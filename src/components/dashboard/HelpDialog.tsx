import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, LayoutDashboard, ShoppingBag, Users, Sparkles, Settings, Share2, Mail } from "lucide-react";

export default function HelpDialog() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" aria-hidden="true" />
          Hjälp
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-emerald-950">Så fungerar din dashboard</SheetTitle>
          <SheetDescription>
            Klicka på en rubrik för att se förklaringen.
          </SheetDescription>
        </SheetHeader>

        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="overview">
            <AccordionTrigger className="text-emerald-950">
              <span className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Översikt
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-stone-600 space-y-2">
              <p>Här ser du klassens framsteg — totalt antal sålda paket Gold och Crema, hur mycket pengar ni hittills tjänat och hur långt det är kvar till ert insamlingsmål.</p>
              <p>Siffrorna uppdateras automatiskt när elever rapporterar eller när du själv skriver in försäljning.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="order">
            <AccordionTrigger className="text-emerald-950">
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" /> Beställning
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-stone-600 space-y-2">
              <p>När klassen sålt klart skickar du in beställningen härifrån. Vi packar och levererar kaffet till adressen du anger, och ni får en faktura på inköpspriset.</p>
              <p>Pengarna ni tjänat = försäljningspris − inköpspris. Det är detta som syns under <em>Översikt</em>.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="students">
            <AccordionTrigger className="text-emerald-950">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" aria-hidden="true" /> Eleverna
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-stone-600 space-y-2">
              <p>Lägg till eleverna i klassen och håll koll på vad var och en sålt. Bra för att se vem som sålt mest eller belöna prestationer.</p>
              <p className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-md p-3">
                <Share2 className="h-4 w-4 text-emerald-700 mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  Klicka på <strong>Dela elevlänk</strong> för att få en länk + QR-kod att skicka till eleverna. De rapporterar sin egen försäljning direkt — antalet adderas automatiskt på deras totalsumma här.
                </span>
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="repurchases">
            <AccordionTrigger className="text-emerald-950">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" aria-hidden="true" /> Återköp
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-stone-600 space-y-2">
              <p>När kampanjen är slut kan kunder fortsätta beställa kaffe via klassens egna återköpslänk — och klassen får en bonus på varje återköp i 6 månader.</p>
              <p>Här ser du alla återköp och hur mycket extra de gett.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="settings">
            <AccordionTrigger className="text-emerald-950">
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4" aria-hidden="true" /> Inställningar
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-stone-600 space-y-2">
              <p>Uppdatera kontaktuppgifter, föreningens uppgifter (för fakturan) och insamlingsmål.</p>
              <p><strong>Spårningsläge</strong>: Välj <em>Per elev</em> om du vill rapportera per elev, eller <em>Sammanlagt</em> om du bara vill skriva in klassens totalsumma utan att dela upp den.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="contact">
            <AccordionTrigger className="text-emerald-950">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" /> Behöver du hjälp?
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-stone-600">
              <p>Hör av dig till <a href="mailto:kontakt@scandinaviancoffee.se" className="text-emerald-700 underline">kontakt@scandinaviancoffee.se</a> så hjälper vi dig.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}