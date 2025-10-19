import { Preview } from '@react-email/components'
import Footer from '../components/Footer'
import IntroWithHi from '../components/IntroWithHi'
import PolarHeader from '../components/PolarHeader'
import Wrapper from '../components/Wrapper'

export function NotificationNewSubscription({
  subscriber_name,
  formatted_price_amount,
  tier_name,
  tier_price_amount,
  tier_price_recurring_interval,
}: {
  subscriber_name: string
  formatted_price_amount: string
  tier_name: string
  tier_price_amount: string
  tier_price_recurring_interval: string
}) {
  return (
    <Wrapper>
      <Preview>Novo assinante {tier_name}</Preview>
      <PolarHeader />
      <IntroWithHi hiMsg="Parabéns!">
        {subscriber_name} agora está assinando <strong>{tier_name}</strong> por{' '}
        {tier_price_amount ? formatted_price_amount : 'grátis'}/
        {tier_price_recurring_interval}.
      </IntroWithHi>
      <Footer />
    </Wrapper>
  )
}

NotificationNewSubscription.PreviewProps = {
  subscriber_name: 'John Doe',
  formatted_price_amount: '$12.95',
  tier_name: 'Pro',
  tier_price_amount: '$12.95',
  tier_price_recurring_interval: 'monthly',
}

export default NotificationNewSubscription
