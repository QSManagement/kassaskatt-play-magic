# Architecture rules
- Keep shared Qlasskassan branding in the common Logo component and a single approved asset; all website placements must reuse it to prevent inconsistent branding.
- Use immutable CDN asset pointers for distributed PDFs and email artwork; update email download URLs whenever branding changes so cached copies cannot remain current.- Colors: Qlasskassan UI uses the blue `brand-*` palette from tailwind.config.ts (matches the logo). Do not use `emerald-*` or other greens for branding. `hf-*` (lime/soft/green) is reserved for HelloFresh contexts; amber/brown is for coffee. Plain `green-*` only for success/status badges.
- Show the Qlasskassan logo once per view (the nav already has it) — no extra logo lockups in page heroes.
