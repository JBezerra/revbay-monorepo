import { Heading, Link, Preview, Section, Text } from '@react-email/components'
import BodyText from '../components/BodyText'
import Button from '../components/Button'
import Footer from '../components/Footer'
import OrganizationHeader from '../components/OrganizationHeader'
import Wrapper from '../components/Wrapper'

interface SubscriptionCancellationProps {
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
}

function BenefitsSection({ benefits }: { benefits: Array<{ description: string }> }) {
  // Only render if there are actual benefits to display
  if (benefits.length === 0) {
    return null
  }
  return (
    <>
      <BodyText>Enquanto isso, você continuará tendo acesso aos seguintes benefícios:</BodyText>
      <ul className="list-disc space-y-1 pl-6">
        {benefits.map((benefit, index) => (
          <li key={index}>{benefit.description}</li>
        ))}
      </ul>
    </>
  )
}

export function SubscriptionCancellation({
  organization,
  product,
  subscription,
  url,
}: SubscriptionCancellationProps) {
  const endDate = new Date(subscription.ends_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Wrapper>
      <Preview>Sua assinatura de {product.name} foi cancelada</Preview>
      <OrganizationHeader organization={organization} />
      <Section className="pt-10">
        <Heading
          as="h1"
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          Sua assinatura foi cancelada
        </Heading>
        <BodyText>
          Lamentamos vê-lo partir! Sua assinatura de{' '}
          <span className="font-bold">{product.name}</span> permanecerá ativa
          até <span className="font-bold">{endDate}</span>, após o que será
          cancelada.
        </BodyText>
        <BodyText>
          Se você mudar de ideia, pode renovar sua assinatura a qualquer momento
          antes da data de término.
        </BodyText>
        <BenefitsSection benefits={product.benefits} />
      </Section>
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

SubscriptionCancellation.PreviewProps = {
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
}

export default SubscriptionCancellation
