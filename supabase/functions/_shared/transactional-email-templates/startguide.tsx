import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Button, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Qlasskassan'

interface StartguideProps {
  name?: string
  schoolName?: string
}

const StartguideEmail = ({ name, schoolName }: StartguideProps) => (
  <Html lang="sv" dir="ltr">
    <Head />
    <Preview>Här är er startguide till {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {name ? `Hej ${name}!` : 'Hej!'}
        </Heading>
        <Text style={text}>
          Tack för att du vill veta mer om {SITE_NAME}
          {schoolName ? ` för ${schoolName}` : ''}. Här kommer en kort
          startguide som hjälper er komma igång på fyra veckor.
        </Text>

        <Section style={card}>
          <Heading as="h2" style={h2}>Så funkar det</Heading>
          <Text style={text}>
            <strong>1. Anmäl klassen</strong> — fyll i anmälan på qlasskassan.se. Vi går igenom anmälan inom 24 timmar.
          </Text>
          <Text style={text}>
            <strong>2. Sälj premiumkaffe</strong> — eleverna säljer Caffè Gondoliere Gold (50 kr/påse till klassen) och Crema (70 kr/påse).
          </Text>
          <Text style={text}>
            <strong>3. Lägg ordern</strong> — när ni samlat in beställningarna lägger ni en gemensam order via dashboarden.
          </Text>
          <Text style={text}>
            <strong>4. Få pengarna</strong> — vi fakturerar och pengarna går direkt till klasskassan. Återköpsklubben ger dessutom +15 kr/påse i passiv inkomst.
          </Text>
        </Section>

        <Section style={{ textAlign: 'center', margin: '32px 0' }}>
          <Button href="https://qlasskassan.se/" style={button}>
            Anmäl klassen nu
          </Button>
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
  component: StartguideEmail,
  subject: 'Er startguide till Qlasskassan',
  displayName: 'Startguide',
  previewData: { name: 'Anna', schoolName: 'Solskolan' },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
}
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '26px', fontWeight: 'bold', color: '#052e16', margin: '0 0 16px' }
const h2 = { fontSize: '18px', fontWeight: 'bold', color: '#052e16', margin: '0 0 12px' }
const text = { fontSize: '15px', color: '#1c1917', lineHeight: '1.6', margin: '0 0 14px' }
const card = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fde68a',
  borderRadius: '12px',
  padding: '20px 22px',
  margin: '20px 0',
}
const button = {
  backgroundColor: '#064e3b',
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