import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Qlasskassan'

interface ClassActivatedProps {
  name?: string
  className?: string
  schoolName?: string
  loginUrl?: string
  classCode?: string
  repurchaseUrl?: string
}

const ClassActivatedEmail = ({ name, className, schoolName, loginUrl, classCode, repurchaseUrl }: ClassActivatedProps) => (
  <Html lang="sv" dir="ltr">
    <Head />
    <Preview>Er klass är aktiverad — dags att dra igång!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {name ? `Hej ${name}!` : 'Hej!'}
        </Heading>
        <Text style={text}>
          Goda nyheter — er klass
          {className ? ` ${className}` : ''}
          {schoolName ? ` på ${schoolName}` : ''} är nu aktiverad i {SITE_NAME}.
          Ni kan logga in och börja sälja direkt.
        </Text>

        {classCode && (
          <Section style={codeCard}>
            <Text style={codeLabel}>Er klasskod</Text>
            <Text style={codeValue}>{classCode}</Text>
            <Text style={codeHelp}>
              Dela koden med era kunder. När de återköper kaffe på{' '}
              <a href={repurchaseUrl ?? 'https://qlasskassan.se/aterkop'} style={link}>
                qlasskassan.se/aterkop
              </a>{' '}
              och anger koden får ni <strong>15 kr per påse</strong> i bonus — automatiskt.
            </Text>
          </Section>
        )}

        {loginUrl && (
          <Section style={{ textAlign: 'center', margin: '28px 0' }}>
            <Button href={loginUrl} style={button}>Logga in på dashboarden</Button>
          </Section>
        )}

        <Section style={{ textAlign: 'center', margin: '8px 0 28px' }}>
          <Button href="https://qlasskassan.se/qlasskassan-saljblad.pdf" style={pdfButton}>
            📄 Beställningsblankett (PDF)
          </Button>
          <Button href="https://qlasskassan.se/qlasskassan-aterkop.pdf" style={{ ...pdfButton, marginLeft: '8px' }}>
            ☕ Återköpsblad — klasskod (PDF)
          </Button>
        </Section>

        <Section style={card}>
          <Heading as="h2" style={h2}>Kom igång på 3 steg</Heading>
          <Text style={text}><strong>1.</strong> Logga in och kontrollera klassinformationen.</Text>
          <Text style={text}><strong>2.</strong> Skriv ut säljbladet och dela ut till eleverna så de kan hålla koll på sin egen försäljning.</Text>
          <Text style={text}><strong>3.</strong> Följ försäljningen i realtid på dashboarden.</Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          Frågor? Mejla oss på{' '}
          <a href="mailto:kontakt@qlasskassan.se" style={link}>
            kontakt@qlasskassan.se
          </a>
        </Text>
        <Text style={footer}>Lycka till! — Teamet bakom {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ClassActivatedEmail,
  subject: 'Er klass är aktiverad i Qlasskassan',
  displayName: 'Klass aktiverad',
  previewData: {
    name: 'Anna',
    className: '7B',
    schoolName: 'Solskolan',
    loginUrl: 'https://kassaskatt-play-magic.lovable.app/logga-in',
    classCode: 'SOLSKOLAN-7B',
    repurchaseUrl: 'https://qlasskassan.se/aterkop?kod=SOLSKOLAN-7B',
  },
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
  backgroundColor: '#052e16',
  color: '#fef3c7',
  padding: '12px 28px',
  borderRadius: '999px',
  fontWeight: 'bold',
  fontSize: '15px',
  textDecoration: 'none',
  display: 'inline-block',
}
const pdfButton = {
  backgroundColor: '#b45309',
  color: '#fffbeb',
  padding: '12px 28px',
  borderRadius: '999px',
  fontWeight: 'bold',
  fontSize: '15px',
  textDecoration: 'none',
  display: 'inline-block',
}
const hr = { borderColor: '#e7e5e4', margin: '32px 0 20px' }
const footer = { fontSize: '13px', color: '#78716c', margin: '0 0 8px' }
const link = { color: '#b45309', textDecoration: 'underline' }
const codeCard = {
  backgroundColor: '#ecfdf5',
  border: '1px solid #a7f3d0',
  borderRadius: '12px',
  padding: '18px 22px',
  margin: '20px 0 24px',
  textAlign: 'center' as const,
}
const codeLabel = {
  fontSize: '12px',
  color: '#047857',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  margin: '0 0 6px',
}
const codeValue = {
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#052e16',
  letterSpacing: '0.08em',
  margin: '0 0 10px',
  fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
}
const codeHelp = {
  fontSize: '13px',
  color: '#1c1917',
  lineHeight: '1.5',
  margin: '0',
}