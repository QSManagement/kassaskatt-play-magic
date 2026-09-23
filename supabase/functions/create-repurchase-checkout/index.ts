import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { z } from "https://esm.sh/zod@3.23.8";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BodySchema = z.object({
  classCode: z.string().trim().min(3).max(20),
  qtyGold: z.number().int().min(0).max(50),
  qtyCrema: z.number().int().min(0).max(50),
  customer: z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().max(40).optional().nullable(),
  }),
  delivery: z.object({
    recipient: z.string().trim().min(1).max(100),
    address: z.string().trim().min(1).max(255),
    postalCode: z.string().trim().min(3).max(20),
    city: z.string().trim().min(1).max(100),
  }),
  notes: z.string().trim().max(500).optional().nullable(),
  returnUrl: z.string().url(),
  environment: z.enum(["sandbox", "live"]),
});

const FALLBACK_PRICES = { gold: 155, crema: 295 } as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: parsed.error.flatten() }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const body = parsed.data;

    if (body.qtyGold + body.qtyCrema === 0) {
      return new Response(JSON.stringify({ error: "Du måste välja minst en förpackning" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Look up the class via the public RPC
    const { data: classRows, error: classError } = await supabase.rpc(
      "lookup_class_by_code",
      { _code: body.classCode },
    );
    if (classError) throw classError;
    const klass = Array.isArray(classRows) ? classRows[0] : classRows;
    if (!klass) {
      return new Response(
        JSON.stringify({ error: "Klasskoden hittades inte. Dubbelkolla att den är rättstavad." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (klass.window_active === false) {
      return new Response(
        JSON.stringify({
          error:
            "Den här klassens återköpsperiod (6 månader) har gått ut. Kontakta oss om ni vill förlänga.",
        }),
        { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Create the pending order row first
    const deliveryAddress = body.delivery.address;
    const { data: orderRow, error: orderError } = await supabase
      .from("orders")
      .insert({
        class_id: klass.id,
        order_type: "repurchase",
        qty_gold: body.qtyGold,
        qty_crema: body.qtyCrema,
        customer_name: body.customer.name,
        customer_email: body.customer.email,
        customer_phone: body.customer.phone ?? null,
        delivery_recipient: body.delivery.recipient,
        delivery_address: deliveryAddress,
        delivery_postal_code: body.delivery.postalCode,
        delivery_city: body.delivery.city,
        notes: body.notes ?? null,
        payment_status: "pending",
      })
      .select("id")
      .single();
    if (orderError) throw orderError;

    // Prices always come from pricing_settings (never from the client)
    const { data: pricingRow } = await supabase
      .from("pricing_settings")
      .select("price_gold_consumer, price_crema_consumer")
      .eq("id", 1)
      .maybeSingle();
    const goldPrice = Number(pricingRow?.price_gold_consumer ?? FALLBACK_PRICES.gold);
    const cremaPrice = Number(pricingRow?.price_crema_consumer ?? FALLBACK_PRICES.crema);

    const stripe = createStripeClient(body.environment as StripeEnv);
    const lineItems: {
      price_data: {
        currency: string;
        unit_amount: number;
        product_data: { name: string; description?: string };
      };
      quantity: number;
    }[] = [];

    if (body.qtyGold > 0) {
      lineItems.push({
        price_data: {
          currency: "sek",
          unit_amount: Math.round(goldPrice * 100),
          product_data: { name: "Caffè Gondoliere Gold – 500 g" },
        },
        quantity: body.qtyGold,
      });
    }
    if (body.qtyCrema > 0) {
      lineItems.push({
        price_data: {
          currency: "sek",
          unit_amount: Math.round(cremaPrice * 100),
          product_data: { name: "Caffè Gondoliere Crema – 1 kg hela bönor" },
        },
        quantity: body.qtyCrema,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: body.returnUrl,
      customer_email: body.customer.email,
      automatic_tax: { enabled: true },
      metadata: {
        order_id: orderRow.id,
        class_id: klass.id,
        class_code: klass.class_code,
        order_type: "repurchase",
      },
    });

    // Persist the session id so the webhook can find the order
    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", orderRow.id);

    return new Response(
      JSON.stringify({
        clientSecret: session.client_secret,
        orderId: orderRow.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    console.error("create-repurchase-checkout error", err);
    const message = err instanceof Error ? err.message : "Okänt fel";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});