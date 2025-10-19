import { Hr, Link, Preview, Section, Text } from '@react-email/components'
import Button from '../components/Button'
import Footer from '../components/Footer'
import IntroWithHi from '../components/IntroWithHi'
import PolarHeader from '../components/PolarHeader'
import Wrapper from '../components/Wrapper'

interface EmailUpdateProps {
  token_lifetime_minutes: number
  url: string
  current_year: number
}

export function EmailUpdate({ token_lifetime_minutes, url }: EmailUpdateProps) {
  return (
    <Wrapper>
      <Preview>
        Aqui está o link de verificação para atualizar seu email
      </Preview>
      <PolarHeader />
      <IntroWithHi>
        Aqui está o link de verificação para atualizar seu email. Clique no
        botão abaixo para completar o processo de atualização.{' '}
        <span className="font-bold">
          Este link é válido apenas pelos próximos {token_lifetime_minutes}{' '}
          minutos.
        </span>
      </IntroWithHi>
      <Section className="my-8 text-center">
        <Button href={url}>Atualizar meu email</Button>
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

EmailUpdate.PreviewProps = {
  token_lifetime_minutes: 30,
  url: 'https://polar.sh/settings/account/email/update?token=abc123',
  current_year: new Date().getFullYear(),
}

export default EmailUpdate
