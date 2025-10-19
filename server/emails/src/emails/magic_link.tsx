import { Button, Section, Text } from '@react-email/components'
import Footer from '../components/Footer'
import IntroWithHi from '../components/IntroWithHi'
import PolarHeader from '../components/PolarHeader'
import Wrapper from '../components/Wrapper'

export function MagicLink({
  token_lifetime_minutes,
  url,
}: {
  token_lifetime_minutes: number
  url: string
}) {
  return (
    <Wrapper>
      <PolarHeader />
      <IntroWithHi>
        Aqui está seu link mágico para entrar no Polar. Clique no botão abaixo para
        completar o processo de login.{' '}
        <span className="font-bold">
          Este link é válido apenas pelos próximos {token_lifetime_minutes} minutos
        </span>
      </IntroWithHi>
      <Section className="text-center">
        <Button
          href={url}
          className="bg-brand rounded-full px-6 py-2 text-xl font-medium leading-4 text-white"
        >
          Entrar
        </Button>
      </Section>
      <Text className="text-gray-500">
        Se você não solicitou este email, pode ignorá-lo com segurança.
      </Text>
      <Footer />
    </Wrapper>
  )
}

MagicLink.PreviewProps = {
  token_lifetime_minutes: 30,
  url: 'https://example.com',
}

export default MagicLink
