import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface AlertEmailProps {
  username: string
  ipo: string
  gmpThreshold: number
}

const AlertEmail = ({ username, ipo, gmpThreshold }: AlertEmailProps) => (
  <Html>
    <Head />
    <Preview>{`GMP of ${ipo} has reached ${gmpThreshold}%`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={'./../../public/favicon.ico'}
          width='32'
          height='32'
          alt='Ipometrics'
          className='rounded-lg'
        />

        <Text style={title}>
          <strong>@{username}</strong>, Alert for {ipo}
        </Text>

        <Section style={section}>
          <div className='p-6'>
            <Text style={text}>
              Hey <strong>{username}</strong>!
            </Text>
            <Text style={text}>
              GMP of <strong>{ipo}</strong> has reached {'>'} <strong>{gmpThreshold}%</strong>.
            </Text>

            <Button
              onClick={() => {
                globalThis.open('https://ipometrics.vaibhu.com/open_ipos', '_blank')
              }}
              style={button}
            >
              Go to IPOMetrics
            </Button>
          </div>
        </Section>

        <Text style={footer}>IPOMetrics ・New Delhi, India</Text>
      </Container>
    </Body>
  </Html>
)

export default AlertEmail

const main = {
  backgroundColor: '#ffffff',
  color: '#24292e',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
}

const container = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '20px 0 48px',
}

const title = {
  fontSize: '24px',
  lineHeight: 1.25,
}

const section = {
  padding: '24px',
  border: 'solid 1px #dedede',
  borderRadius: '5px',
  textAlign: 'center' as const,
}

const text = {
  margin: '0 0 10px 0',
  textAlign: 'left' as const,
}

const button = {
  fontSize: '14px',
  backgroundColor: '#28a745',
  color: '#fff',
  lineHeight: 1.5,
  borderRadius: '0.5em',
  padding: '12px 24px',
  cursor: 'pointer',
}

const links = {
  textAlign: 'center' as const,
}

const link = {
  color: '#0366d6',
  fontSize: '12px',
}

const footer = {
  color: '#6a737d',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '60px',
}
