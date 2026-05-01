import { createClient } from "jsr:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const Body = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  school_name: z.string().trim().min(2).max(120),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) {
      return json({ error: parsed.error.flatten().fieldErrors }, 400);
    }
    const { name, email, school_name } = parsed.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1. Save lead
    const { error: insertError } = await supabase
      .from("startguide_leads")
      .insert({ name, email, school_name });
    if (insertError) {
      console.error("insert error", insertError);
      return json({ error: "Kunde inte spara begäran" }, 500);
    }

    // 2. Send email via transactional pipeline using the SDK invoke,
    //    which builds a correctly-signed JWT for the gateway.
    const { error: sendErr } = await supabase.functions.invoke(
      "send-transactional-email",
      {
        body: {
          templateName: "startguide",
          recipientEmail: email,
          idempotencyKey: `startguide-${email}-${Date.now()}`,
          templateData: { name, schoolName: school_name },
        },
      },
    );
    if (sendErr) {
      console.error("mail send failed:", sendErr);
      return json({ error: "Kunde inte skicka mejlet just nu. Försök igen om en stund." }, 500);
    }

    return json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return json({ error: err?.message || "Server error" }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
