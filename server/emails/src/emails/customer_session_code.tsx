import { Link, Preview, Section, Text } from '@react-email/components'
import Footer from '../components/Footer'
import IntroWithHi from '../components/IntroWithHi'
import OrganizationHeader from '../components/OrganizationHeader'
import OTPCode from '../components/OTPCode'
import Wrapper from '../components/Wrapper'

interface CustomerSessionCodeProps {
  organization: {
    name: string
    slug: string
  }
  code: string
  code_lifetime_minutes: number
  url: string
  current_year: number
}

export function CustomerSessionCode({
  organization,
  code,
  code_lifetime_minutes,
  url,
}: CustomerSessionCodeProps) {
  return (
    <Wrapper>
      <Preview>
        Aqui está seu código para acessar suas compras da {organization.name}
      </Preview>
      <OrganizationHeader organization={organization} />
      <IntroWithHi>
        Aqui está seu código para acessar suas compras da {organization.name}. Clique
        no botão abaixo para completar o processo de login.{' '}
        <span className="font-bold">
          Este código é válido apenas pelos próximos {code_lifetime_minutes} minutos.
        </span>
      </IntroWithHi>
      <OTPCode code={code} />
      <Section className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          Você deve inserir este código na seguinte URL
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

CustomerSessionCode.PreviewProps = {
  organization: {
    name: 'Acme Inc.',
    slug: 'acme-inc',
  },
  code: 'ABC123',
  code_lifetime_minutes: 30,
  url: 'https://polar.sh/acme-inc/portal/authenticate',
  current_year: new Date().getFullYear(),
}

export default CustomerSessionCode
