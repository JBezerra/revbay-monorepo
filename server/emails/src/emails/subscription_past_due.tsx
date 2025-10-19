import { Heading, Link, Preview, Section, Text } from '@react-email/components'
import BodyText from '../components/BodyText'
import Button from '../components/Button'
import Footer from '../components/Footer'
import OrganizationHeader from '../components/OrganizationHeader'
import Wrapper from '../components/Wrapper'

interface SubscriptionPastDueProps {
  organization: {
    name: string
    slug: string
  }
  product: {
    name: string
    benefits: Array<{
      description: string
    }>
  }
  subscription: {
    ends_at: string // ISO date string
  }
  url: string
  current_year: number
  payment_url?: string
}

export function SubscriptionPastDue({
  organization,
  product,
  url,
  payment_url,
}: SubscriptionPastDueProps) {
  return (
    <Wrapper>
      <Preview>O pagamento da sua assinatura {product.name} está em atraso</Preview>
      <OrganizationHeader organization={organization} />
      <Section className="pt-10">
        <Heading
          as="h1"
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          O pagamento da sua assinatura está em atraso
        </Heading>
        <BodyText>
          Não conseguimos processar seu pagamento para sua assinatura{' '}
          <span className="font-bold">{product.name}</span>. Sua
          assinatura agora está em atraso e o acesso aos benefícios foi temporariamente
          suspenso.
        </BodyText>
        <BodyText>
          Para restaurar o acesso aos benefícios da sua assinatura, atualize seu
          método de pagamento e complete o pagamento.
        </BodyText>
      </Section>
      {payment_url && (
        <Section className="my-8 text-center">
          <Button href={payment_url}>Completar Pagamento</Button>
        </Section>
      )}
      <Section className="my-8 text-center">
        <Button href={url}>Gerenciar minha assinatura</Button>
      </Section>
      <Section className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          Se você está tendo problemas com o botão acima, copie e cole a URL
          abaixo no seu navegador:
        </Text>
        <Text className="text-sm">
          <Link
            href={url}
            className="text-blue-600 underline dark:text-blue-400"
          >
            {url}
          </Link>
        </Text>
      </Section>
      <Footer />
    </Wrapper>
  )
}

SubscriptionPastDue.PreviewProps = {
  organization: {
    name: 'Acme Inc.',
    slug: 'acme-inc',
  },
  product: {
    name: 'Premium Subscription',
    benefits: [
      { description: 'Access to premium features' },
      { description: 'Priority customer support' },
      { description: 'Advanced analytics' },
    ],
  },
  subscription: {
    ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  },
  url: 'https://polar.sh/acme-inc/portal/subscriptions/12345',
  current_year: new Date().getFullYear(),
  payment_url: 'https://invoice.stripe.com/i/acct_123/test',
}

export default SubscriptionPastDue
