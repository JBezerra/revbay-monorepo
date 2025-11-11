import { Link, Preview } from '@react-email/components'
import BodyText from '../components/BodyText'
import Footer from '../components/Footer'
import PolarHeader from '../components/PolarHeader'
import Wrapper from '../components/Wrapper'

export function NotificationAccountUnderReview({
  account_type,
}: {
  account_type: string
}) {
  return (
    <Wrapper>
      <Preview>Sua conta TropicPay está sendo revisada</Preview>
      <PolarHeader />
      <BodyText>Olá,</BodyText>
      <BodyText>
        Desculpe, não queremos assustá-lo. As revisões de conta são completamente normais
        e fazem parte dos nossos esforços contínuos de conformidade aqui no TropicPay.
      </BodyText>
      <BodyText>
        Atualmente, sua conta {account_type} e organizações conectadas a ela
        estão sendo revisadas como parte deste processo automatizado.
      </BodyText>
      <BodyText>
        Realizamos essas revisões antes do primeiro pagamento e depois automaticamente após
        certos limites de vendas.
      </BodyText>
      <BodyText>Você pode ler mais sobre nossas revisões de conta aqui:</BodyText>
      <Link href="https://dub.sh/polar-review">
        https://dub.sh/polar-review
      </Link>
      <BodyText>
        Então não há motivo para se preocupar. Normalmente, nossas revisões são concluídas em
        24-48h.
      </BodyText>
      <BodyText>
        Entraremos em contato em breve caso precisemos de mais informações suas
        para nossa revisão.
      </BodyText>
      <Footer />
    </Wrapper>
  )
}

NotificationAccountUnderReview.PreviewProps = {
  account_type: 'Stripe Connect Express',
}

export default NotificationAccountUnderReview
