
## Mål

Uppdatera sortimentet på hela hemsidan så att:

- **Classic försvinner helt** — namnet och produkten finns inte kvar någonstans.
- **Gold tar över Classics plats** (basprodukt, 199 kr / 60 kr till klassen, mellanrostad blandning).
- **Crema** (ny lyxig 1 kg bönor, 100% Arabica) tar över Goldens plats som premium/bästsäljare (249 kr / 80 kr till klassen).
- Priser behålls oförändrade.

Slutresultat: två produkter på sidan — **Gold** (vänster, basprodukt) och **Crema** (höger, premium/bästsäljare).

## Ändringar

### 1. Bilder (`src/assets/`)
- Ladda upp den bifogade Crema-bilden som `src/assets/coffee-crema.png`.
- `coffee-classic.png` blir oanvänd och tas bort.
- `coffee-gold.png` behålls (samma bild som idag, men flyttar till basprodukt-positionen).

### 2. Produktkort (`src/pages/Index.tsx`, sektionen "Sortimentet")
- **Vänster kort (basprodukt):** Använd nuvarande Gold-bild + namn "Gold", pris 199 kr, 60 kr till klassen, beskrivning "Mellanrostat, balanserat och rikt. En smak som passar alla.", behåll de gröna emerald-tonerna i gradient/badge så det fortfarande känns som "vardagsvalet".
  - Bullets: `40% Arabica / 60% Robusta`, `Vakuumförpackad 500g`, `Hållbarhet 18 mån`.
- **Höger kort (premium, BÄSTSÄLJARE):** Ny Crema-bild + namn "Crema", pris 249 kr, 80 kr till klassen, beskrivning "100% Arabica från höglänta odlingar. Hela bönor, mjuk crema och elegant fyllighet — vår lyxigaste blend.", behåll amber-tonerna i gradient/badge.
  - Bullets: `100% Arabica`, `Hela bönor, vakuumförpackad 1 kg`, `Rainforest Alliance-certifierad`.

### 3. Kalkylator (samma fil, rad ~290–340)
- Variabler döps om för läsbarhet: `goldRatio` → `cremaRatio`, `goldBags` → `cremaBags`, `classicBags` → `goldBags`, `goldEarnings` → `cremaEarnings`, `classicEarnings` → `goldEarnings`. Funktion: oförändrad — bara namnen ändras.
- Etiketter:
  - "Andel Gold (premium)" → "Andel Crema (premium)"
  - "Bara Classic" / "Bara Gold" → "Bara Gold" / "Bara Crema"
  - Resultatraderna: "Gold (X påsar × 80 kr)" → "Crema (X påsar × 80 kr)" och "Classic (X påsar × 60 kr)" → "Gold (X påsar × 60 kr)".

### 4. Trust-strip (rad ~213)
- "100% Arabica i Gold" → "100% Arabica i Crema".

### 5. Återköpsklubben — exempel-dashboard (rad ~483–486)
- Byt "Gold" → "Crema" och "Classic" → "Gold" i de fyra exempel-raderna.

### 6. FAQ (rad ~655–657)
- "Gold är 100 % höglands-Arabica" → "Crema är 100 % höglands-Arabica i hela bönor".
- "60 % Gold-mix" → "60 % Crema-mix".

### 7. Footer (rad ~709–710)
- "Classic 500g" / "Gold 500g" → "Gold 500g" / "Crema 1 kg bönor".

### 8. Plan-dokumentet
- `.lovable/plan.md` uppdateras kort så produkt-referenserna (Classic/Gold) byts mot Gold/Crema med rätt vikter och format, så framtida ändringar har korrekt baseline.

## Utanför scope

- Inga ändringar i priser, layout, färgpalett eller sektionsordning.
- Inga ändringar i registrering, backend, mailflöden eller logga.
