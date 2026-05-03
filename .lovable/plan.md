# Centralisera priser + ta bort kontaktinfo i footer

Två saker:

## 1. Ta bort telefon + öppettider i footern
I `src/pages/Index.tsx` (footer-kolumnen "Kontakt") tas raderna `070-123 45 67` och `Vardagar 9-17` bort. E-postadressen behålls.

## 2. Admin-styrda priser

### Ny tabell `pricing_settings` (singleton)
| kolumn | typ | beskrivning |
|---|---|---|
| `id` | int PK (alltid 1) | singleton |
| `price_gold_consumer` | numeric | återköp / konsumentpris Gold (idag 169) |
| `price_crema_consumer` | numeric | återköp / konsumentpris Crema (idag 249) |
| `price_gold_class` | numeric | klassens inköpspris Gold (idag 119) |
| `price_crema_class` | numeric | klassens inköpspris Crema (idag 179) |
| `margin_gold` | numeric | till klassen per Gold-påse (idag 50) |
| `margin_crema` | numeric | till klassen per Crema-påse (idag 70) |
| `repurchase_bonus` | numeric | bonus per återköpspåse (idag 15) |
| `updated_at`, `updated_by` | | |

**RLS**: alla autentiserade får läsa (SELECT), endast admin får uppdatera. Edge functions läser via service role.

### Databasändringar
- Skriv om `calculate_order_totals()` så den läser från `pricing_settings` istället för hårdkodade `* 50`, `* 70`, `* 119`, `* 169`, `* 179`, `* 249`.
- Skriv om `calculate_repurchase_bonus()` så den läser `repurchase_bonus` istället för `* 15`.
- Seeda raden med dagens värden så inget bryts.

### Frontend — läs priser via en hook
Ny `usePricing()` (React Query, cache 5 min) som hämtar `pricing_settings`. Används i:
- `src/pages/Repurchase.tsx` (ersätter `PRICE_GOLD`/`PRICE_CREMA`-konstanterna)
- `src/components/dashboard/OrderTab.tsx` (rad 178, 255, 267, 496 — beräkning + texter)
- `src/pages/Index.tsx` — kalkylatorn (rad 43–44), prisrutorna (rad 392, 398, 429, 435), kalkylraderna (rad 345, 352) och jämförelsetabellen (rad 603, 608)
- `src/components/dashboard/OverviewTab.tsx` (rad 291 — "15 kr/påse")

För Index-sidan: visa skeleton-värden tills hooken laddat, eller initiera med dagens defaults så sidan inte hoppar.

### Edge functions
- `create-repurchase-checkout/index.ts` — beräkna totals från `pricing_settings` istället för hårdkodat. Säkerhetsskäl: aldrig lita på pris från klienten.
- `payments-webhook/index.ts` — om den refererar priser, läs från db.

### Ny admin-vy: `src/components/admin/AdminPricing.tsx`
- Formulär med alla 7 fält
- Förhandsvisning: "Vid ändring uppdateras alla nya beställningar och kalkylatorn på hemsidan omedelbart."
- Sparar via supabase.update; visar `updated_at` + vem som uppdaterade
- Lägg till flik "Priser" i `AdminDashboard.tsx`

### Viktigt — påverkar INTE befintliga ordrar
`calculate_order_totals` triggas vid INSERT/UPDATE av en order. Tidigare ordrar har sina totals lagrade och förändras inte. Bra: ingen retroaktiv prisändring på fakturerade beställningar.

## Vad jag INTE gör
- Ingen versionshistorik på priser (kan läggas till senare om revision behövs)
- Ingen schemaläggning av framtida prisändringar
- PDF-säljbladen (`qlasskassan-saljblad.pdf`, `qlasskassan-aterkop.pdf`) uppdateras inte automatiskt — om priser ändras behöver de regenereras manuellt. Notering visas i admin-vyn.

## Steg
1. Migration: skapa tabell + RLS + seed + skriv om de två triggers
2. Ny `usePricing` hook + uppdatera alla 4 frontend-filer
3. Uppdatera edge functions
4. Bygg `AdminPricing`-vyn + flik i admin
5. Ta bort telefon/öppettider i Index-footern
