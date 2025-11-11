'use client'

import { DashboardBody } from '@/components/Layout/DashboardLayout'
import OrganizationAccessTokensSettings from '@/components/Settings/OrganizationAccessTokensSettings'
import OrganizationNotificationSettings from '@/components/Settings/OrganizationNotificationSettings'
import OrganizationProfileSettings from '@/components/Settings/OrganizationProfileSettings'
import { Section, SectionDescription } from '@/components/Settings/Section'
import { schemas } from '@polar-sh/client'

export default function ClientPage({
  organization: org,
}: {
  organization: schemas['Organization']
}) {
  return (
    <DashboardBody
      wrapperClassName="!max-w-screen-sm"
      title="Configurações da Organização"
    >
      <div className="flex flex-col gap-y-12">
        <Section id="organization">
          <SectionDescription title="Perfil" />
          <OrganizationProfileSettings organization={org} />
        </Section>

        <Section id="developers">
          <SectionDescription
            title="Desenvolvedores"
            description="Gerencie API Keys para autenticar com a API da TropicPay"
          />
          <OrganizationAccessTokensSettings organization={org} />
        </Section>

        <Section id="notifications">
          <SectionDescription title="Notificações" />
          <OrganizationNotificationSettings organization={org} />
        </Section>
      </div>
    </DashboardBody>
  )
}
