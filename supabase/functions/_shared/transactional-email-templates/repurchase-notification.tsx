import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Qlasskassan'

interface RepurchaseNotificationProps {
  teacherName?: string
  className?: string
  schoolName?: string
  qtyGold?: number
  qtyCrema?: number
  bonusToClass?: number
  totalEarned?: number
  dashboardUrl?: string
}

const RepurchaseNotificationEmail = ({
  teacherName,
  className,
  schoolName,
  qtyGold = 0,
  qtyCrema = 0,
  bonusToClass = 0,
  totalEarned,
  dashboardUrl,
}: RepurchaseNotificationProps) => {
  const totalBags = qtyGold + qtyCrema
  return (
    <Html lang="sv" dir="ltr">
      <Head />
      <Preview>Ny återköpsorder — +{bonusToClass} kr till klassen</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {teacherName ? `Hej ${teacherName}!` : 'Hej!'}
          </Heading>
          <Text style={text}>
            Klassen{className ? ` ${className}` : ''}
            {schoolName ? ` på ${schoolName}` : ''} har precis fått en ny återköpsorder
            via {SITE_NAME}.
          </Text>

          <Section style={bonusCard}>
            <Text style={bonusLabel}>Bonus till klassen</Text>
            <Text style={bonusValue}>+{bonusToClass.toLocaleString('sv-SE')} kr</Text>
            <Text style={bonusHelp}>
              {totalBags} påse{totalBags === 1 ? '' : 'r'} kaffe
              {qtyGold > 0 ? ` · ${qtyGold} Gold` : ''}
              {qtyCrema > 0 ? ` · ${qtyCrema} Crema` : ''}
            </Text>
          </Section>

          {typeof totalEarned === 'number' && totalEarned > 0 && (
            <Text style={text}>
              Totalt insamlat hittills: <strong>{totalEarned.toLocaleString('sv-SE')} kr</strong>
            </Text>
          )}

          {dashboardUrl && (
            <Section style={{ textAlign: 'center', margin: '24px 0' }}>
              <Button href={dashboardUrl} style={button}>Öppna dashboarden</Button>
            </Section>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            Vi packar och skickar kaffet inom 5 arbetsdagar — ni behöver inte göra något.
          </Text>
          <Text style={footer}>Hälsningar, Teamet bakom {SITE_NAME}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: RepurchaseNotificationEmail,
  subject: (data: Record<string, any>) =>
    `Ny återköpsorder · +${(data.bonusToClass ?? 0).toLocaleString('sv-SE')} kr till klassen`,
  displayName: 'Återköp – notis till lärare',
  previewData: {
    teacherName: 'Anna',
    className: '7B',
    schoolName: 'Solskolan',
    qtyGold: 2,
    qtyCrema: 1,
    bonusToClass: 45,
    totalEarned: 4350,
    dashboardUrl: 'https://qlasskassan.se/dashboard',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
}
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#052e16', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#1c1917', lineHeight: '1.6', margin: '0 0 14px' }
const bonusCard = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fde68a',
  borderRadius: '12px',
  padding: '20px 22px',
  margin: '20px 0 24px',
  textAlign: 'center' as const,
}
const bonusLabel = {
  fontSize: '12px',
  color: '#92400e',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  margin: '0 0 4px',
}
const bonusValue = {
  fontSize: '32px',
  fontWeight: 'bold' as const,
  color: '#052e16',
  margin: '0 0 6px',
}
const bonusHelp = { fontSize: '13px', color: '#78716c', margin: '0' }
const button = {
  backgroundColor: '#052e16',
  color: '#fef3c7',
  padding: '12px 28px',
  borderRadius: '999px',
  fontWeight: 'bold' as const,
  fontSize: '15px',
  textDecoration: 'none',
  display: 'inline-block',
}
const hr = { borderColor: '#e7e5e4', margin: '28px 0 18px' }
const footer = { fontSize: '13px', color: '#78716c', margin: '0 0 8px' }