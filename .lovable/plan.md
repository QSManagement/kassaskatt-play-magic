# Juridiska sidor för Qlasskassan

Skapar tre nya sidor med svensk text anpassad för verksamheten, samt länkar i footern på landningssidan och i auth-/dashboard-vyer.

## Nya sidor

### `/integritetspolicy` (`src/pages/Integritetspolicy.tsx`)
Innehåll:
- **Personuppgiftsansvarig** — Qlasskassan + kontakt-e-post (placeholder `info@qlasskassan.se`, ni byter)
- **Vilka uppgifter vi samlar in**:
  - Lärare: namn, e-post, telefon, skola, klass (vid registrering)
  - Föräldrar/återköpskunder: namn, e-post, leveransadress, betalinfo (via Stripe)
  - Leads: namn, e-post, skola (startguide-formulär)
  - Elever: namn (om läraren lägger in dem för intern uppföljning)
- **Ändamål och rättslig grund** (tabell):
  - Lärarkonto → avtal
  - Beställning/leverans → avtal
  - Marknadskommunikation → samtycke (avregistrering via länk i varje mejl)
  - Återköpsnotiser → berättigat intresse
  - Bokföring → rättslig förpliktelse (7 år enligt BFL)
- **Mottagare/underbiträden**: Lovable Cloud (Supabase, EU), Stripe (betalning), Resend (e-post), Caffè Gondoliere (leverans)
- **Lagringstid**: konto så länge aktivt + 12 mån, leads 24 mån, bokföringsunderlag 7 år
- **Dina rättigheter**: tillgång, rättelse, radering, dataportabilitet, klagomål till IMY
- **Överföring utanför EU/EES**: notering om att Resend/Stripe kan involvera USA med SCC
- **Kontakt** för dataskyddsfrågor

### `/villkor` (`src/pages/Villkor.tsx`)
- Allmänt om tjänsten (klassinsamling, lärare beställer, faktura mot förening/skola)
- Beställning och avtal (när bindande)
- Priser, betalning (faktura 30 dagar / Stripe vid återköp)
- Leverans (fri till skolan, leveranstid)
- Reklamation (livsmedel, omedelbart vid mottagande)
- Ångerrätt — undantag för livsmedel enligt distansavtalslagen 2 kap 11 §
- Ansvarsbegränsning
- Tvist (svensk lag, ARN)

### `/cookies` (`src/pages/Cookies.tsx`)
Kort sida som förklarar att Qlasskassan **endast använder nödvändiga cookies** (Supabase-auth-session) och därför inte kräver samtyckesbanner. Tabell med:
- `sb-access-token` / `sb-refresh-token` — auth, sessionscookies
- Ingen analytics, inga tracking-pixlar i nuläget

Notering om att det uppdateras om tracking läggs till framöver.

## Footer-länkar

- Lägg till en enkel `<Footer>`-komponent (`src/components/Footer.tsx`) med tre länkar: Integritetspolicy, Villkor, Cookies + copyright `© Qlasskassan`
- Visa footern på:
  - `src/pages/Index.tsx` (landningssidan)
  - `src/pages/Login.tsx`
  - `src/pages/Repurchase.tsx` och `RepurchaseSuccess.tsx`
- Dashboard-sidor (lärare/admin) får inte footer — de är arbetsverktyg

## Routing

I `src/App.tsx`, ovanför catch-all-routen:
```tsx
<Route path="/integritetspolicy" element={<Integritetspolicy />} />
<Route path="/villkor" element={<Villkor />} />
<Route path="/cookies" element={<Cookies />} />
```

## Design

- Återanvänd befintliga semantiska tokens (`emerald-950`, `stone-50`, `amber-50`)
- Samma `<Logo>` + bakgrund som `Unsubscribe.tsx`
- Läsvänlig typografi: max-width ~720px, generös radhöjd, tydliga `<h2>`-rubriker
- "Senast uppdaterad: 3 maj 2026" högst upp

## Vad jag INTE gör i detta steg

- Ingen cookie-banner (behövs inte med endast nödvändiga cookies)
- Ingen rate limiting (separat steg om du vill)
- Ingen säkerhetsskanning (separat steg)
- Inga ändringar i mejlmallar — kan länka till policyn i en senare iteration

## Innan jag går live

Du behöver bekräfta/fylla i:
- Företagsnamn + org.nr som ska stå som personuppgiftsansvarig
- Kontakt-e-post för dataskyddsfrågor (default: `info@qlasskassan.se`)
- Ev. fysisk adress för villkoren

Jag använder rimliga placeholders som är tydligt markerade så ni kan byta dem efteråt.
