import { Link, Preview, Text } from '@react-email/components'
import BodyText from '../components/BodyText'
import Button from '../components/Button'
import Footer from '../components/Footer'
import IntroWithHi from '../components/IntroWithHi'
import PolarHeader from '../components/PolarHeader'
import Wrapper from '../components/Wrapper'

export function NotificationCreateAccount({
  organization_name,
  url,
}: {
  organization_name: string
  url: string
}) {
  return (
    <Wrapper>
      <Preview>Sua conta TropicPay está sendo revisada</Preview>
      <PolarHeader />
      <IntroWithHi>
        Agora que você recebeu seu primeiro pagamento da {organization_name}, você deve
        criar uma conta de pagamento para receber seus fundos.
      </IntroWithHi>
      <BodyText>
        Suportamos Stripe e Open Collective. Esta operação leva apenas alguns
        minutos e permite que você receba seu dinheiro imediatamente.
      </BodyText>
      <Button href={url}>Criar minha conta de pagamento</Button>
      <Text>
        Se você está tendo problemas com o botão acima, copie e cole a URL
        abaixo no seu navegador.
      </Text>
      <Link href={url}>{url}</Link>
      <Footer />
    </Wrapper>
  )
}

NotificationCreateAccount.PreviewProps = {
  organization_name: 'Acme Inc.',
  url: 'https://polar.sh',
}

export default NotificationCreateAccount
