import { Preview, Section, Text } from '@react-email/components'
import Button from '../components/Button'
import Footer from '../components/Footer'
import IntroWithHi from '../components/IntroWithHi'
import PolarHeader from '../components/PolarHeader'
import Wrapper from '../components/Wrapper'

export function OrganizationInvite({
  organization_name,
  inviter_email,
  invite_url,
}: {
  organization_name: string
  inviter_email: string
  invite_url: string
}) {
  return (
    <Wrapper>
      <Preview>Você foi adicionado à {organization_name} na RevBay</Preview>
      <PolarHeader />
      <IntroWithHi>
        {inviter_email} adicionou você à{' '}
        <span className="font-bold">{organization_name}</span> na RevBay.
      </IntroWithHi>
      <Section>
        <Text>
          Como membro da {organization_name} você agora pode gerenciar
          produtos, clientes e assinaturas da {organization_name} na RevBay.
        </Text>
      </Section>
      <Section className="text-center">
        <Button href={invite_url}>Ir para o painel da RevBay</Button>
      </Section>
      <Footer />
    </Wrapper>
  )
}

OrganizationInvite.PreviewProps = {
  organization_name: 'Acme Inc.',
  inviter_email: 'admin@acme.com',
  invite_url: 'https://polar.sh/dashboard/acme-inc',
}

export default OrganizationInvite
