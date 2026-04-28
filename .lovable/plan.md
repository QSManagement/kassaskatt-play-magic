# Klasskassa – Landningssida

Implementera landningssidan från `klasskassa-site.tsx` exakt — design, copy, struktur och interaktivitet (kalkylator, scroll-effekt på nav) — med tre korrigeringar.

## Korrigeringar mot originalfilen

1. **Ursprung**: Ta bort all "italienskt"-formulering. Caffè Gondoliere är holländskt (Ahold Delhaize Coffee Company).
   - Hero-paragraf: "...premium kaffe från Caffè Gondoliere — produkter folk faktiskt vill köpa, igen och igen."
   - Footer-tagline: "Premium kaffe för klassinsamlingar. Officiell svensk partner till Caffè Gondoliere."
   - Trust-strip-rad: behåll "Ett av Europas största rosterier".
   - Produktkort Classic: ta bort "klassiska italienska smaken" → "Mellanrostat, balanserat och rikt. En smak som passar alla."
2. **Hero "Live räknare"**: Ersätt placeholder-siffror med "Lansering 2026"-status.
   - Rubrik byts från "Klasser tjänade ihop förra månaden" → "Status".
   - Stora siffran "2 847 320 kr" → "Lansering 2026".
   - "+34% mot förra året" → tas bort.
   - Listan "Aktiva klasser / Påsar sålda / Snitt per klass" → ersätts med "Anmäl er klass tidigt — först till kvarn till hösten 2026".
   - Den roterade badge "Genomsnitt 14 200 kr per klass" → "Tidig anmälan öppen".
3. Behåll allt annat (kalkylator, produktpriser 60/80 kr, återköpsklubben med exempel-dashboard som tydligt är ett "Räkneexempel", jämförelsetabell, trygghetssektion, CTA, footer).

## Sektioner (oförändrad ordning)

1. Fast nav med scroll-bakgrund
2. Hero (text + korrigerad status-widget)
3. Trust strip (Caffè Gondoliere, Rainforest Alliance, 100% Arabica i Gold, Europas största rosterier)
4. Så funkar det – 3 steg
5. Kalkylator – reglage för elever, påsar/elev, andel Gold
6. Produkter – Classic (199 kr / 60 kr till klass) + Gold (249 kr / 80 kr till klass, bästsäljare)
7. Återköpsklubben – USP med QR-kod + räkneexempel
8. Jämförelsetabell – kaffe vs kakor vs kryddor
9. Trygghet – 4 fördelar
10. Stor CTA
11. Footer

## Tekniskt

- Ersätt `src/pages/Index.tsx` med komponenten från filen, inklusive korrigeringarna ovan.
- Beroenden: `lucide-react` används redan i projektet (Coffee, Calculator, Package, TrendingUp, Heart, ShieldCheck, Truck, Sparkles, ArrowRight, Check, Users, Repeat). Inga nya paket behövs.
- Tailwind-färger (emerald, amber, stone) finns i standard Tailwind v3 — inga config-ändringar.
- Knappar är icke-funktionella i detta steg (registrering, mailguide, "läs mer" osv. lämnas som rena UI-element). Inga formulär kopplas.
- Ingen backend, ingen databas, inga nya routes.

## Utanför scope

Registrering, dashboard, webbshop, formulärinsamling och Lovable Cloud — byggs i nästa steg.
