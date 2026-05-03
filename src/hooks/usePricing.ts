import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Pricing = {
  price_gold_consumer: number;
  price_crema_consumer: number;
  price_gold_class: number;
  price_crema_class: number;
  margin_gold: number;
  margin_crema: number;
  repurchase_bonus: number;
};

export const DEFAULT_PRICING: Pricing = {
  price_gold_consumer: 169,
  price_crema_consumer: 249,
  price_gold_class: 119,
  price_crema_class: 179,
  margin_gold: 50,
  margin_crema: 70,
  repurchase_bonus: 15,
};

let cache: Pricing | null = null;
let inflight: Promise<Pricing> | null = null;

async function fetchPricing(): Promise<Pricing> {
  const { data, error } = await supabase
    .from("pricing_settings")
    .select("price_gold_consumer, price_crema_consumer, price_gold_class, price_crema_class, margin_gold, margin_crema, repurchase_bonus")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return DEFAULT_PRICING;
  const out: Pricing = {
    price_gold_consumer: Number(data.price_gold_consumer),
    price_crema_consumer: Number(data.price_crema_consumer),
    price_gold_class: Number(data.price_gold_class),
    price_crema_class: Number(data.price_crema_class),
    margin_gold: Number(data.margin_gold),
    margin_crema: Number(data.margin_crema),
    repurchase_bonus: Number(data.repurchase_bonus),
  };
  cache = out;
  return out;
}

export function usePricing(): Pricing {
  const [pricing, setPricing] = useState<Pricing>(cache ?? DEFAULT_PRICING);
  useEffect(() => {
    if (cache) {
      setPricing(cache);
      return;
    }
    if (!inflight) inflight = fetchPricing();
    inflight.then((p) => setPricing(p)).finally(() => { inflight = null; });
  }, []);
  return pricing;
}

export function clearPricingCache() {
  cache = null;
  inflight = null;
}