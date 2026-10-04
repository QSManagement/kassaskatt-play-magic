# HelloFresh i Qlasskassan

## Del 1 — Databas & backend (klar)
- `pricing_settings.margin_hellofresh` (200), tabell `hellofresh_signups`, triggers (normalisering, provision, statusflöde, räknekolonner på klassen), RLS (endast admin), RPC `public_create_hellofresh_signup` + `get_class_hellofresh_signups`.

## Del 2 — Frontend
1. Bilder i `src/assets/hellofresh/`, tailwind `hf`-färger, `SiteFooter`/`SiteNav`, "HelloFresh"-länk i nav.
2. `usePricing` + `AdminPricing` med `margin_hellofresh`.
3. Publik sida `/hellofresh` + kundformulär `/hellofresh/anmal/:code` + affisch `/hellofresh/affisch/:code`.
4. `StudentReport.tsx`: Kaffe/HelloFresh-växel.
5. Lärardashboard: ny HelloFresh-flik, kontrollerade tabs, OverviewTab/StudentsTab/SalesLogTab/OrderTab/HelpDialog.
6. Admin: `AdminHelloFresh` (tabell, massåtgärder, CSV, utbetalningsunderlag), AdminClassDetail/AdminClasses/AdminOverview.
7. Index.tsx: produktkort, kalkylatorreglage, FAQ, footer.
8. Integritetspolicy + Villkor: HelloFresh-avsnitt.
