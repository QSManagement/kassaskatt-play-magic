
# Återköpsklubben — egen butik på qlasskassan.se

Mål: föräldrar/kunder beställer kaffe direkt på qlasskassan.se via Stripe Checkout, anger en klasskod så rätt klass får 15 kr/påse, och ordern landar i admin **separat** från klassbeställningarna.

---

## 1. Databasändringar (migration)

### `class_registrations` — ny kolumn `class_code`
- `class_code text unique not null` — kort, läsbar, slumpmässig kod (t.ex. `KAF-7B9X2`)
- Auto-genereras via trigger när en klass skapas (eller bakåtfylls för befintliga klasser)
- Format: `KAF-` + 5 tecken (versaler + siffror, exklusive O/0/I/1 för läsbarhet)

### `orders` — markera ordertyp + kundinfo
Lägger till på befintliga `orders`-tabellen (för att återanvända allt befintligt admin-flöde):
- `order_type text not null default 'class'` — `'class'` eller `'repurchase'`
- `customer_name text` — endast för återköp
- `customer_email text` — endast för återköp
- `customer_phone text` — endast för återköp (valfritt)
- `stripe_session_id text unique` — för att undvika dubbelregistrering vid webhook
- `payment_status text default 'pending'` — `pending` / `paid` / `failed`
- `paid_at timestamptz`

### `repurchases` — koppla till order
- `source_order_id` finns redan — vi använder den för att länka till `orders`-raden

### Triggers
- `auto_create_repurchase_on_paid` — när en `order` med `order_type='repurchase'` får `payment_status='paid'`, skapas automatiskt en rad i `repurchases` (15 kr/påse) kopplad till klassen via `class_id`
- `update_class_counters` — uppdateras så att `order_type='repurchase'` **inte** räknas in i klassens `total_sold_gold/crema/total_to_class` (den siffran är bara för klassens egen försäljning; återköp syns separat under "Återköp" som idag)

### RLS
- Public `INSERT` på `orders` när `order_type='repurchase'` och `payment_status='pending'` (så checkout-sidan kan skapa ordern utan inlogg). Allt annat kräver auth som idag.
- Public `SELECT` på `class_registrations.class_code` för att kunna validera koden anonymt — vi exponerar bara `id`, `school_name`, `class_name`, `class_code` via en RPC `lookup_class_by_code(code)`.

---

## 2. Stripe-betalning (Lovable's inbyggda Stripe)

### Setup
- Aktivera Lovable's **Stripe Payments** (built-in, inget eget konto krävs för test). Du fyller i mejl/företag i en dialog när vi enabler.
- Två produkter skapas automatiskt:
  - **Gold malet** — 169 kr inkl. moms
  - **Crema bönor** — 249 kr inkl. moms
  - Tax behandling: **Tax calculation only** (Stripe räknar moms 6 %, ni handhar registrering/redovisning)
- Frakt: **fri frakt** (ingen separat fraktrad i Stripe)

### Edge functions
- `create-repurchase-checkout` — tar emot `{ class_code, items: [{product, quantity}], customer: {name, email, phone}, delivery: {recipient, address, postal_code, city} }`, validerar klasskoden, skapar `orders`-rad (`order_type='repurchase'`, `payment_status='pending'`), skapar Stripe Checkout Session med `success_url` → `/aterkop/tack?session_id=...`, returnerar Stripe URL.
- `stripe-repurchase-webhook` — lyssnar på `checkout.session.completed`, sätter `payment_status='paid'` + `paid_at` på ordern via `stripe_session_id`. Triggern skapar automatiskt `repurchases`-raden.

---

## 3. Publik återköpssida `/aterkop`

Ny route i `src/App.tsx` (öppen, ingen auth):

```text
┌─────────────────────────────────────────────────────────┐
│  Logo   Qlasskassan                                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   Köp kaffe — stötta klassen                             │
│   Ange klasskoden från säljbladet så får klassen        │
│   15 kr per påse i bonus.                                │
│                                                          │
│   ┌──────────────────────────────────┐                  │
│   │ Klasskod:  [ KAF-_____ ] ✓ 7B   │                  │
│   │            Storvretsskolan       │                  │
│   └──────────────────────────────────┘                  │
│                                                          │
│   ┌─────────────┐  ┌─────────────┐                      │
│   │ Gold malet  │  │ Crema bönor │                      │
│   │   169 kr    │  │   249 kr    │                      │
│   │   [- 1 +]   │  │   [- 0 +]   │                      │
│   └─────────────┘  └─────────────┘                      │
│                                                          │
│   Leveransadress                                         │
│   [ Mottagare ]                                          │
│   [ Adress ]                                             │
│   [ Postnr ] [ Ort ]                                     │
│                                                          │
│   Dina uppgifter                                         │
│   [ Namn ] [ E-post ] [ Telefon (valfritt) ]             │
│                                                          │
│   ──────────────────────────────                         │
│   Totalt:        169 kr (varav moms 9,57 kr)             │
│   Klassen får:   +15 kr                                  │
│                                                          │
│   [    Gå till betalning  →    ]                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

- Live-validering av klasskoden (debounced) → visar skola + klassnamn när matchning hittas
- Zod-validering på alla fält
- Klickar "Gå till betalning" → anropar `create-repurchase-checkout` → redirect till Stripe
- `/aterkop/tack` — bekräftelsesida som visar "Tack! Din beställning är registrerad och X kr går till {klass}."

---

## 4. Klasskod synlig för läraren

I `OverviewTab.tsx` lägger jag ett nytt kort högst upp (under huvudkortet):

```text
┌─────────────────────────────────────────────────────┐
│ 🎟  Er klasskod                                      │
│                                                      │
│     KAF-7B9X2          [ Kopiera ]                   │
│                                                      │
│  Dela koden med era kunder. När de återköper kaffe  │
│  på qlasskassan.se/aterkop och anger koden får ni   │
│  15 kr per påse — automatiskt.                       │
│                                                      │
│  Direktlänk: qlasskassan.se/aterkop?kod=KAF-7B9X2   │
│                                          [ Kopiera ] │
└─────────────────────────────────────────────────────┘
```

- Direktlänken förifyller koden på återköpssidan
- Knapp för att kopiera kod respektive länk

---

## 5. Admin-vyn — separera ordertyper

I `AdminOrders.tsx`:
- **Ny tab/filter högst upp**: `Klassbeställningar` | `Återköp` (default = klassbeställningar, så det inte blandas)
- Återköpsfliken visar egna kolumner: Datum, Klass + kod, Kund (namn/mejl/tel), Antal, Belopp, Leveransadress, Betalstatus (Stripe), Leveransstatus, Radera
- Stat-kort högst upp uppdateras per flik (klassorder visar fakturerat; återköp visar Stripe-intäkt + utbetald bonus)
- I `AdminClassDetail.tsx` läggs en separat "Återköpsorder"-sektion under befintliga ordrar

---

## 6. Rensa felaktiga referenser till scandinaviancoffee.se

Dessa måste uppdateras eftersom återköp nu sker på qlasskassan.se:

- `src/pages/Index.tsx` rad 470: "Återköper de kaffet på scandinaviancoffee.se inom 6 månader" → "Återköper de kaffet på **qlasskassan.se/aterkop** med klasskoden inom 6 månader"
- `src/pages/Index.tsx` rad 671 (FAQ): samma ändring + nämn att klasskoden står på säljbladet
- `src/components/dashboard/RepurchasesTab.tsx` rad 56 + 74: byt scandinaviancoffee.se → qlasskassan.se/aterkop
- `public/qlasskassan-saljblad.pdf`: regenerera PDF:en med rätt URL och klasskod-platshållare (eller dynamisk länk per klass — se nedan)
- `public/qlasskassan-startguide.pdf`: kontrolleras och uppdateras om referensen finns där också

**Lämnas orörda** (det är kontaktmejl, inte återköpsplats):
- `kontakt@scandinaviancoffee.se` i mejlmallar och PendingApproval (det är er supportadress)
- `notify.scandinaviancoffee.se` i edge functions (det är er sender-domän)

### Säljbladet — två alternativ
- **A)** Statisk PDF i `public/` med generell text "Ange er klasskod på qlasskassan.se/aterkop" (klassen skriver in koden själv på sin utskrift)
- **B)** Dynamisk PDF som genereras per klass med deras unika kod + QR-kod färdigtryckt → kräver en edge function `generate-saljblad` som tar `class_id` och spottar ut PDF. Mer jobb men proffsigare.

Frågar dig nedan vilket du vill ha.

---

## 7. Mejlmallar

- `class-activated.tsx` (mejl när klass godkänns): lägg till klasskoden i en framträdande box + länken till `/aterkop?kod=...` så lärarna har den direkt
- Ny transactional `repurchase-confirmation.tsx`: skickas till **kunden** efter Stripe-betalning ("Tack för ditt köp! Vi packar och skickar inom X dagar. {klass} får {bonus} kr tack vare dig.")
- Ny transactional `repurchase-notification.tsx`: skickas till **läraren** ("Ny återköpsorder! En av era kunder köpte X påsar — +Y kr till klassen.")

---

## 8. Tekniska detaljer

**Filer som ändras/skapas:**
- Ny migration: `class_code`, `order_type`, kund-fält, `stripe_session_id`, RLS, RPC `lookup_class_by_code`, trigger `auto_create_repurchase_on_paid`, uppdaterad `update_class_counters`
- Ny: `src/pages/Repurchase.tsx` (publik checkout-sida)
- Ny: `src/pages/RepurchaseSuccess.tsx` (`/aterkop/tack`)
- Ny edge function: `create-repurchase-checkout/index.ts`
- Ny edge function: `stripe-repurchase-webhook/index.ts`
- Ny mejlmall: `repurchase-confirmation.tsx`, `repurchase-notification.tsx`
- Edit: `src/App.tsx` (routes `/aterkop`, `/aterkop/tack`)
- Edit: `src/components/dashboard/OverviewTab.tsx` (klasskod-kort)
- Edit: `src/components/admin/AdminOrders.tsx` (flikfilter klass/återköp)
- Edit: `src/components/admin/AdminClassDetail.tsx` (separat återköpssektion)
- Edit: `src/pages/Index.tsx` (texter)
- Edit: `src/components/dashboard/RepurchasesTab.tsx` (texter)
- Edit: `supabase/functions/_shared/transactional-email-templates/class-activated.tsx`
- Regenerera: `public/qlasskassan-saljblad.pdf`

**Stripe:** aktiveras via Lovable's built-in Stripe Payments. Test-läge fungerar direkt — för riktiga betalningar behöver ni claim:a Stripe-kontot senare.

**Inga nya secrets behövs** (Stripe-secrets hanteras automatiskt av Lovable Cloud när vi enabler).

---

## Frågor innan jag bygger

1. **Säljbladet** — vill du ha **A) statisk PDF** med plats där läraren skriver in klasskoden för hand vid utskrift, eller **B) dynamisk per-klass-PDF** med kod + QR redan inbakad (genereras när klassen aktiveras)?
2. **Återköpsperiod 6 månader** — ska systemet faktiskt hindra återköp efter 6 mån från klassens första order (visa "Den här klassens återköpsperiod har gått ut")? Eller låter vi det vara öppet för nu och bara nämner 6 mån i marknadsföringstexten?
3. **Bonus till klass kontra Stripe-intäkt** — när Stripe drar sina avgifter (~3 % + 2 kr per kortköp) från 169 kr, är 15 kr/påse till klassen + er marginal fortfarande hållbart? Bara så vi vet att ekonomin går ihop innan vi kör skarpt. (Påverkar inte bygget, bara en sanity-check.)
