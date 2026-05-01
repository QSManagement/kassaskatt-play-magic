import { isStripeTestMode } from "@/lib/stripe";

export function PaymentTestModeBanner() {
  if (!isStripeTestMode()) return null;

  return (
    <div className="w-full bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-sm text-amber-900">
      Testläge — inga riktiga pengar dras. Använd kortnummer{" "}
      <code className="font-mono font-medium">4242 4242 4242 4242</code> för att testa betalning.
    </div>
  );
}