## Plan: Säljblad till klasser

Säljbladet (PDF) blir tillgängligt på två ställen: i dashboarden som en alltid-tillgänglig nedladdningsknapp, och som en länk i mejlet "klass aktiverad" så lärarna får det direkt när kontot godkänns.

### 1. Lägg PDF:en i projektet
- Kopiera `Qlasskassan_säljblad.pdf` till `public/qlasskassan-saljblad.pdf` så den kan laddas ner direkt från `https://qlasskassan.se/qlasskassan-saljblad.pdf` (samma mönster som befintliga `qlasskassan-startguide.pdf`).

### 2. Nedladdningsknapp i Dashboarden (Översikt)
I `src/components/dashboard/OverviewTab.tsx` läggs ett nytt kort till längst ner — ett "Material & resurser"-kort med en tydlig knapp:

```
┌────────────────────────────────────────────────┐
│ 📄  Säljblad för klassen                       │
│ Skriv ut och dela ut till eleverna för att     │
│ hålla koll på sin egen försäljning.            │
│                                                │
│         [ Ladda ner säljblad (PDF) ]           │
└────────────────────────────────────────────────┘
```

Knappen är en `<a href="/qlasskassan-saljblad.pdf" download>` stylad som primary Button (samma gröna ton som resten av dashboarden). Ikon: `Download` eller `FileText` från lucide-react.

**Varför Översikt-fliken?** Det är första vyn lärare ser när de loggar in, så materialet är omedelbart hittbart. Vi kan även överväga att lägga den i Beställning-fliken senare om lärare efterfrågar det, men en plats räcker för att hålla UI:n ren.

### 3. Uppdatera "Klass aktiverad"-mejlet
I `supabase/functions/_shared/transactional-email-templates/class-activated.tsx`:
- Lägg till en ny knapp/länk under "Logga in på dashboarden" som heter **"📄 Ladda ner säljblad (PDF)"**, stylad i amber-ton (samma som PDF-knappen i startguide-mejlet) så den tydligt skiljer sig från huvud-CTA.
- Länkar till `https://qlasskassan.se/qlasskassan-saljblad.pdf`.
- Lägg till en kort mening i "Kom igång på 3 steg"-kortet som nämner att de kan skriva ut säljbladet och dela ut till eleverna.

### 4. Deploy
Deploya `send-transactional-email` så den uppdaterade template-registret används. (Edge functions serverar bara senast deployade kod.)

### Tekniska detaljer
- **Filer som ändras:**
  - `public/qlasskassan-saljblad.pdf` (ny — kopia av uppladdad PDF)
  - `src/components/dashboard/OverviewTab.tsx` (nytt resurs-kort längst ner)
  - `supabase/functions/_shared/transactional-email-templates/class-activated.tsx` (PDF-knapp + uppdaterad steg-text)
- **Edge function deploy:** `send-transactional-email`
- **Inga DB-ändringar, ingen ny route, inga nya secrets.**

### Frågor innan jag bygger
1. Ska säljbladsknappen ligga i **Översikt-fliken** (förslaget ovan) eller hellre i **Beställning-fliken** där lärarna jobbar med själva försäljningen — eller på båda ställena?
2. Ska säljbladet även länkas i **startguide-mejlet** (det som skickas till leads innan de signat upp), eller bara i aktiveringsmejlet till godkända klasser?
