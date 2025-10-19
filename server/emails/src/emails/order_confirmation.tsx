import {
  Heading,
  Hr,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import BodyText from '../components/BodyText'
import Button from '../components/Button'
import Footer from '../components/Footer'
import OrganizationHeader from '../components/OrganizationHeader'
import Wrapper from '../components/Wrapper'

interface OrderConfirmationProps {
  organization: {
    name: string
    slug: string
  }
  product: {
    name: string
  }
  url: string
  current_year: number
}

export function OrderConfirmation({
  organization,
  product,
  url,
}: OrderConfirmationProps) {
  return (
    <Wrapper>
      <Preview>Obrigado pelo seu pedido de {product.name}!</Preview>
      <OrganizationHeader organization={organization} />
      <Section className="pt-12">
        <Heading
          as="h1"
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          Obrigado pelo seu pedido!
        </Heading>
        <BodyText>
          Seu pedido de <span className="font-bold">{product.name}</span> foi
          processado.
        </BodyText>
      </Section>
      <Section className="my-8 text-center">
        <Button href={url}>Acessar minha compra</Button>
      </Section>
      <Hr />
      <Section className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          Se você está tendo problemas com o botão acima, copie e cole a URL
          abaixo no seu navegador.
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

OrderConfirmation.PreviewProps = {
  organization: {
    name: 'Acme Inc.',
    slug: 'acme-inc',
  },
  product: {
    name: 'Premium Subscription',
  },
  url: 'https://polar.sh/acme-inc/portal/orders/12345',
  current_year: new Date().getFullYear(),
}

export default OrderConfirmation
