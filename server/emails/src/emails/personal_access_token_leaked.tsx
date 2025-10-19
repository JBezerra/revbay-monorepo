import { Link, Preview, Section, Text } from '@react-email/components'
import Footer from '../components/Footer'
import InfoBox from '../components/InfoBox'
import PolarHeader from '../components/PolarHeader'
import Wrapper from '../components/Wrapper'

interface PersonalAccessTokenLeakedProps {
  notifier: string
  url?: string
  personal_access_token: string
  current_year: number
}

export function PersonalAccessTokenLeaked({
  notifier,
  url,
  personal_access_token,
}: PersonalAccessTokenLeakedProps) {
  return (
    <Wrapper>
      <Preview>
        Aviso importante de segurança: Seu token de acesso pessoal foi vazado
      </Preview>
      <PolarHeader />
      <Section>
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          Aviso importante de segurança
        </Text>
        <Text>
          Fomos notificados de que um de seus tokens de acesso pessoal foi
          vazado. Para sua segurança, revogamos automaticamente este token de
          acesso.{' '}
          <span className="font-bold">
            Você precisará criar um novo e atualizar suas integrações
            existentes para que continuem funcionando.
          </span>
        </Text>
        <Text>
          Nos próximos dias, tenha muito cuidado com qualquer atividade suspeita em
          sua conta e entre em contato conosco se tiver alguma dúvida.
        </Text>
      </Section>
      <InfoBox title="Detalhes do vazamento" variant="warning">
        <ul className="list-disc space-y-1 pl-6">
          <li>Notificador: {notifier}</li>
          {url && <li>URL: {url}</li>}
          <li>Token de Acesso Pessoal: {personal_access_token}</li>
        </ul>
        <Text className="mb-0 mt-4 text-sm text-gray-600 dark:text-gray-400">
          Como lembrete, tokens de acesso pessoal são valores super sensíveis que
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

PersonalAccessTokenLeaked.PreviewProps = {
  notifier: 'GitHub',
  url: 'https://github.com/example/repo',
  personal_access_token: 'token_xyz789',
  current_year: new Date().getFullYear(),
}

export default PersonalAccessTokenLeaked
