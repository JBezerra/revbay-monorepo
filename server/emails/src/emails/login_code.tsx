import { Preview, Section, Text } from '@react-email/components'
import Footer from '../components/Footer'
import IntroWithHi from '../components/IntroWithHi'
import PolarHeader from '../components/PolarHeader'
import Wrapper from '../components/Wrapper'

export function LoginCode({
  code,
  code_lifetime_minutes,
}: {
  code: string
  code_lifetime_minutes: number
}) {
  return (
    <Wrapper>
      <Preview>
        Seu código para entrar é {code}. É válido pelos próximos{' '}
        {code_lifetime_minutes.toString()} minutos.
      </Preview>
      <PolarHeader />
      <IntroWithHi>
        Aqui está seu código para entrar na TropicPay.{' '}
        <span className="font-bold">
          Este código é válido apenas pelos próximos {code_lifetime_minutes}{' '}
          minutos.
        </span>
      </IntroWithHi>
      <Section className="text-center">
        <Text className="text-brand text-5xl font-bold tracking-wider">
          {code}
        </Text>
      </Section>
      <Text className="text-gray-500">
        Se você não solicitou este email, pode ignorá-lo com segurança.
      </Text>
      <Footer />
    </Wrapper>
  )
}

LoginCode.PreviewProps = {
  code: 'ABC123',
  code_lifetime_minutes: 30,
}

export default LoginCode
