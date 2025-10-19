import { Link, Preview, Section, Text } from '@react-email/components'
import Footer from '../components/Footer'
import InfoBox from '../components/InfoBox'
import PolarHeader from '../components/PolarHeader'
import Wrapper from '../components/Wrapper'

interface OAuth2LeakedClientProps {
  token_type: 'client_secret' | 'client_registration_token'
  notifier: string
  url?: string
  client_name: string
  current_year: number
}

export function OAuth2LeakedClient({
  token_type,
  notifier,
  url,
  client_name,
}: OAuth2LeakedClientProps) {
  return (
    <Wrapper>
      <Preview>
        Aviso importante de segurança: Seu OAuth2{' '}
        {token_type === 'client_secret'
          ? 'Client Secret'
          : 'Client Registration Token'}{' '}
        foi vazado publicamente
      </Preview>
      <PolarHeader />
      <Section>
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          Aviso importante de segurança
        </Text>
        {token_type === 'client_secret' ? (
          <Text>
            Fomos notificados de que seu OAuth2 Client Secret foi vazado publicamente.
            Para sua segurança, geramos automaticamente um novo.{' '}
            <span className="font-bold">
              Você precisará atualizar suas integrações existentes para que continuem
              funcionando.
            </span>
          </Text>
        ) : (
          <Text>
            Fomos notificados de que seu OAuth2 Client Registration Token foi
            vazado publicamente. Para sua segurança, geramos automaticamente
            um novo.
          </Text>
        )}
        <Text>
          Nos próximos dias, tenha muito cuidado com qualquer atividade suspeita em
          sua conta e entre em contato conosco se tiver alguma dúvida.
        </Text>
      </Section>
      <InfoBox title="Detalhes do vazamento" variant="warning">
        <ul className="list-disc space-y-1 pl-6">
          <li>Notificador: {notifier}</li>
          {url && <li>URL: {url}</li>}
          <li>Cliente OAuth2: {client_name}</li>
        </ul>
        <Text className="mb-0 mt-4 text-sm text-gray-600 dark:text-gray-400">
          Como lembrete, segredos de cliente OAuth2 são valores super sensíveis que
          não devem ser compartilhados publicamente na web ou em um repositório de código. Use
          recursos dedicados para armazenar segredos com segurança, como{' '}
          <Link
            href="https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions"
            className="text-blue-600 underline dark:text-blue-400"
          >
            GitHub Actions secrets
          </Link>
          .
        </Text>
      </InfoBox>
      <Section className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          Você pode ler mais sobre por que recebeu este alerta em nosso{' '}
          <Link
            href="https://docs.polar.sh/documentation/integration-guides/authenticating-with-polar#security"
            className="text-blue-600 underline dark:text-blue-400"
          >
            FAQ
          </Link>
          .
        </Text>
      </Section>
      <Footer />
    </Wrapper>
  )
}

OAuth2LeakedClient.PreviewProps = {
  token_type: 'client_secret' as const,
  notifier: 'GitHub',
  url: 'https://github.com/example/repo',
  client_name: 'My OAuth2 App',
  current_year: new Date().getFullYear(),
}

export default OAuth2LeakedClient
