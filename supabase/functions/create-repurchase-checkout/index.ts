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

const PRICE_LOOKUPS = {
  gold: "kaffe_gold_169",
  crema: "kaffe_crema_249",
} as const;

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
      return new Response(JSON.stringify({ error: "Du måste välja minst en påse" }), {
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

    // Build line items via Stripe lookup_keys
    const stripe = createStripeClient(body.environment as StripeEnv);
    const lineItems: { price: string; quantity: number }[] = [];
    const wantedKeys: string[] = [];
    if (body.qtyGold > 0) wantedKeys.push(PRICE_LOOKUPS.gold);
    if (body.qtyCrema > 0) wantedKeys.push(PRICE_LOOKUPS.crema);

    const prices = await stripe.prices.list({ lookup_keys: wantedKeys, active: true });
    const priceByLookup = new Map(prices.data.map((p) => [p.lookup_key ?? "", p.id]));

    if (body.qtyGold > 0) {
      const id = priceByLookup.get(PRICE_LOOKUPS.gold);
      if (!id) throw new Error("Pris saknas för Gold");
      lineItems.push({ price: id, quantity: body.qtyGold });
    }
    if (body.qtyCrema > 0) {
      const id = priceByLookup.get(PRICE_LOOKUPS.crema);
      if (!id) throw new Error("Pris saknas för Crema");
      lineItems.push({ price: id, quantity: body.qtyCrema });
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