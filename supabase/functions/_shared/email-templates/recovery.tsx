/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Återställ ditt lösenord för Qlasskassan</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Återställ ditt lösenord</Heading>
        <Text style={text}>
          Vi fick en begäran om att återställa ditt lösenord för Qlasskassan.
          Klicka på knappen nedan för att välja ett nytt lösenord.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Återställ lösenord
        </Button>
        <Text style={footer}>
          Om du inte begärt någon återställning kan du bortse från detta mail.
          Ditt lösenord kommer inte att ändras.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }
const container = { padding: '20px 25px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#022c22',
  margin: '0 0 20px',
  letterSpacing: '-0.01em',
}
const text = {
  fontSize: '15px',
  color: '#44403c',
  lineHeight: '1.6',
  margin: '0 0 25px',
}
const button = {
  backgroundColor: '#022c22',
  color: '#fcd34d',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '14px 28px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#78716c', margin: '30px 0 0', borderTop: '1px solid #e7e5e4', paddingTop: '20px' }
