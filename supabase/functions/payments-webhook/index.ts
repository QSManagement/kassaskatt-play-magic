import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { type StripeEnv, createStripeClient, getWebhookSecret } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const env = (url.searchParams.get("env") === "live" ? "live" : "sandbox") as StripeEnv;

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400, headers: corsHeaders });
  }

  const rawBody = await req.text();
  const stripe = createStripeClient(env);
  const webhookSecret = getWebhookSecret(env);

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return new Response("Invalid signature", { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as { id: string; payment_status: string; metadata?: Record<string, string> };
      const orderId = session.metadata?.order_id;

      if (orderId && session.payment_status === "paid") {
        const { error } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            paid_at: new Date().toISOString(),
            invoice_status: "paid",
          })
          .eq("id", orderId)
          .eq("payment_status", "pending"); // idempotency guard
        if (error) console.error("Failed to mark order paid", error);
      }
    }

    if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as { metadata?: Record<string, string> };
      const orderId = session.metadata?.order_id;
      if (orderId) {
        await supabase
          .from("orders")
          .update({ payment_status: "failed" })
          .eq("id", orderId)
          .eq("payment_status", "pending");
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook handler error", err);
    return new Response("Webhook error", { status: 500, headers: corsHeaders });
  }
});