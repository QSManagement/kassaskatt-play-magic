import * as React from 'npm:react@18.3.1'
import { EmailBrand } from '../email-brand.tsx'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Button, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Qlasskassan'

interface StartguideProps {
  name?: string
  schoolName?: string
}

const StartguideHFEmail = ({ name, schoolName }: StartguideProps) => (
  <Html lang="sv" dir="ltr">
    <Head />
    <Preview>Här är er startguide till {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <EmailBrand />
        <Heading style={h1}>
          {name ? `Hej ${name}!` : 'Hej!'}
        </Heading>
        <Text style={text}>
          Tack för att du vill veta mer om {SITE_NAME}
          {schoolName ? ` för ${schoolName}` : ''}. Här kommer en kort
          startguide som hjälper er komma igång – i er egen takt.
        </Text>

        <Section style={card}>
          <Heading as="h2" style={h2}>Så funkar HelloFresh-försäljningen</Heading>
          <Text style={text}><strong>1. Registrera klassen</strong> — gratis på qlasskassan.se, samma konto som kaffet.</Text>
          <Text style={text}><strong>2. Dela klassens länk</strong> — kunden anmäler sig på en minut och betalar HelloFresh direkt.</Text>
          <Text style={text}><strong>3. Klassen får 150 kr</strong> — per godkänd ny kund, utbetalt till föreningens konto.</Text>
        </Section>

        <Section style={{ textAlign: 'center', margin: '28px 0 12px' }}>
          <Button href="https://qlasskassan.se/qlasskassan-hellofresh-startguide.pdf" style={pdfButton}>📄 Ladda ner startguide (PDF)</Button>
        </Section>
        <Section style={{ textAlign: 'center', margin: '12px 0' }}>
          <Button href="https://qlasskassan.se/qlasskassan-hellofresh.pdf" style={pdfButton}>📄 Säljblad (PDF)</Button>
        </Section>
        <Section style={{ textAlign: 'center', margin: '12px 0' }}>
          <Button href="https://qlasskassan.se/qlasskassan-hellofresh-avtal.pdf" style={pdfButton}>📄 Samarbetsavtal (PDF)</Button>
        </Section>
        <Section style={{ textAlign: 'center', margin: '24px 0 32px' }}>
          <Button href="https://qlasskassan.se/hellofresh" style={button}>Registrera klassen</Button>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          Frågor? Mejla oss på{' '}
          <a href="mailto:kontakt@scandinaviancoffee.se" style={link}>
            kontakt@scandinaviancoffee.se
          </a>
        </Text>
        <Text style={footer}>Vänliga hälsningar, Teamet bakom {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: StartguideHFEmail,
  subject: 'Er HelloFresh-startguide från Qlasskassan',
  displayName: 'Startguide HelloFresh',
  previewData: { name: 'Anna', schoolName: 'Solskolan' },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
}
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '26px', fontWeight: 'bold', color: '#0B1D45', margin: '0 0 16px' }
const h2 = { fontSize: '18px', fontWeight: 'bold', color: '#0B1D45', margin: '0 0 12px' }
const text = { fontSize: '15px', color: '#1c1917', lineHeight: '1.6', margin: '0 0 14px' }
const card = {
  backgroundColor: '#eef8e4',
  border: '1px solid #9be15d',
  borderRadius: '12px',
  padding: '20px 22px',
  margin: '20px 0',
}
const button = {
  backgroundColor: '#102F6B',
  color: '#fffbeb',
  fontSize: '15px',
  fontWeight: 'bold',
  padding: '12px 28px',
  borderRadius: '999px',
  textDecoration: 'none',
}
const pdfButton = {
  backgroundColor: '#b45309',
  color: '#fffbeb',
  fontSize: '15px',
  fontWeight: 'bold',
  padding: '12px 28px',
  borderRadius: '999px',
  textDecoration: 'none',
}
const hr = { borderColor: '#e7e5e4', margin: '32px 0 20px' }
const footer = { fontSize: '13px', color: '#78716c', margin: '0 0 8px' }
const link = { color: '#b45309', textDecoration: 'underline' }