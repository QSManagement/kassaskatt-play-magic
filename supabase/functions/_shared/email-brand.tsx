import * as React from 'npm:react@18.3.1'
import { Img, Link, Section } from 'npm:@react-email/components@0.0.22'

/** Shared, unmodified Qlasskassan artwork for every outgoing email. */
export const EmailBrand = () => (
  <Section style={{ margin: '0 0 28px', textAlign: 'center' }}>
    <Link href="https://qlasskassan.se">
      <Img
        src="https://qlasskassan.se/__l5e/assets-v1/801ebd3f-21e9-41fc-8650-b87905b3760b/qlasskassan-logo-email-2026.jpg"
        alt="Qlasskassan – Sveriges starkaste insamlingskoncept"
        width="300"
        height="82"
        style={{ display: 'block', width: '300px', maxWidth: '100%', height: 'auto', margin: '0 auto' }}
      />
    </Link>
  </Section>
)