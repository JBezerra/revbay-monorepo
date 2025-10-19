import { Preview } from '@react-email/components'
import BodyText from '../components/BodyText'
import Footer from '../components/Footer'
import IntroWithHi from '../components/IntroWithHi'
import PolarHeader from '../components/PolarHeader'
import Wrapper from '../components/Wrapper'

export function NotificationAccountReviewed() {
  return (
    <Wrapper>
      <Preview>Revisão da conta RevBay concluída</Preview>
      <PolarHeader />
      <IntroWithHi hiMsg="Parabéns!">
        Temos o prazer de informar que a revisão da sua conta RevBay foi
        concluída com sucesso.
      </IntroWithHi>
      <BodyText>
        Agradecemos sua paciência durante este processo e estamos animados para
        crescer juntos!
      </BodyText>
      <Footer />
    </Wrapper>
  )
}

NotificationAccountReviewed.PreviewProps = {}

export default NotificationAccountReviewed
