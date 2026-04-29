import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Qlasskassan'

interface WelcomeProps {
  name?: string
  className?: string
  schoolName?: string
}

const RegistrationWelcomeEmail = ({ name, className, schoolName }: WelcomeProps) => (
  <Html lang="sv" dir="ltr">
    <Head />
    <Preview>Tack för er anmälan till {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {name ? `Tack ${name}!` : 'Tack för er anmälan!'}
        </Heading>
        <Text style={text}>
          Vi har tagit emot anmälan
          {className ? ` för ${className}` : ''}
          {schoolName ? ` på ${schoolName}` : ''}. Vi går igenom alla
          anmälningar manuellt och hör av oss inom 24 timmar med ett
          aktiveringsmejl.
        </Text>

        <Section style={card}>
          <Heading as="h2" style={h2}>Vad händer nu?</Heading>
          <Text style={text}>
            <strong>1.</strong> Vi granskar er anmälan (inom 24 timmar).
          </Text>
          <Text style={text}>
            <strong>2.</strong> Ni får ett aktiveringsmejl när kontot är klart.
          </Text>
          <Text style={text}>
            <strong>3.</strong> Ni loggar in på dashboarden, drar igång försäljningen och bygger klasskassan.
          </Text>
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
  component: RegistrationWelcomeEmail,
  subject: 'Tack för er anmälan till Qlasskassan',
  displayName: 'Anmälan mottagen',
  previewData: { name: 'Anna', className: '7B', schoolName: 'Solskolan' },
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
const hr = { borderColor: '#e7e5e4', margin: '32px 0 20px' }
const footer = { fontSize: '13px', color: '#78716c', margin: '0 0 8px' }
const link = { color: '#b45309', textDecoration: 'underline' }