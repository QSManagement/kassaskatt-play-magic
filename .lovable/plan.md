## Verifiering & ändringar — Översikt och Beställning

### 1. Trigger-bekräftelse (databas)

Verifierat direkt mot databasen:

- Triggern **`orders_update_class_counters`** är **aktiv** (`tgenabled = 'O'`) på `public.orders`.
- Den körs **AFTER INSERT OR UPDATE OR DELETE FOR EACH ROW** och anropar `update_class_counters()`.
- Funktionen räknar om `total_sold_gold`, `total_sold_crema` och `total_to_class` på `class_registrations` baserat på summan av alla `orders` för klassen.

Det betyder: hjältekortets siffra på Översikt ändras endast när en order skickas in, ändras eller raderas — precis som specificerat.

### 2. OverviewTab.tsx — ta bort student-rollupen

Dagens kod räknar in `students.sold_gold/sold_crema` i Översiktens totaler. Det ska tas bort så att Översikt enbart speglar `class_registrations`-fälten (som triggern uppdaterar från `orders`).

Ändringar i `src/components/dashboard/OverviewTab.tsx`:

- Ta bort `studentTotals`-state och tillhörande `useEffect` som hämtar från `students`.
- Ta bort `projectedToClass` och `Math.max(...)`-logiken.
- `totalEarned` blir: `Number(klass.total_to_class || 0) + repurchaseTotal`.
- Korten "Gold sålda" / "Crema sålda" visar `klass.total_sold_gold` / `klass.total_sold_crema` direkt.
- `repurchaseTotal`-hämtningen behålls oförändrad (återköp ska fortsatt synas).

### 3. OrderTab.tsx — info-ruta

I `src/components/dashboard/OrderTab.tsx`:

- Lägg till `Info` i import från `lucide-react` (bredvid befintliga `Loader2, Send, Package`).
- Placera den specificerade info-rutan **direkt ovanför** `<Button type="submit">…Skicka in beställning</Button>` inuti formuläret:

```tsx
<div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-600 flex items-start gap-2 mb-4">
  <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-stone-500" aria-hidden="true" />
  <p>
    <strong>Översikt uppdateras när ni skickat in beställningen.</strong>
    {' '}Använd Eleverna-fliken som arbetsverktyg under tiden — där sparas
    elevernas siffror automatiskt utan att påverka Översikt.
  </p>
</div>
```

- Befintlig "Fyll i från eleverna"-knapp och student-summarutan behålls (de läser från `students` lokalt i Beställning-fliken, inte i Översikt).

### 4. Vad som INTE ändras

- `StudentsTab.tsx` — fortsätter spara per-elev-siffror i `students` (arbetsverktyg).
- `OrderTab.tsx` "Fyll i från eleverna" — kvar, hjälper läraren att bygga ordern.
- Återköpsvisning på Översikt — kvar.
- Inga DB-migrationer behövs.

### Sammanfattning av filer som ändras

- `src/components/dashboard/OverviewTab.tsx` — ta bort student-rollup-logiken.
- `src/components/dashboard/OrderTab.tsx` — lägg till `Info`-import och info-ruta ovanför submit-knappen.