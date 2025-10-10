import { useAccount, useOrganizationAccount } from '@/hooks/queries'
import { ACCOUNT_TYPE_DISPLAY_NAMES, ACCOUNT_TYPE_ICON } from '@/utils/account'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { schemas } from '@polar-sh/client'
import Button from '@polar-sh/ui/components/atoms/Button'
import Banner from '@polar-sh/ui/components/molecules/Banner'
import Link from 'next/link'
import Icon from '../Icons/Icon'

const GenericAccountBanner: React.FC<{
  account: schemas['Account'] | undefined
  setupLink: string
}> = ({ account, setupLink }) => {
  const isActive = account?.status === 'active'
  const isUnderReview = account?.status === 'under_review'

  if (!account) {
    return (
      <>
        <Banner
          color="default"
          right={
            <Link href={setupLink}>
              <Button size="sm">Configurar</Button>
            </Link>
          }
        >
          <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
          <span className="text-sm">
            Você precisa configurar uma <strong>conta de pagamento</strong> para receber pagamentos
          </span>
        </Banner>
      </>
    )
  }

  if (account && isUnderReview) {
    const AccountTypeIcon = ACCOUNT_TYPE_ICON[account.account_type]
    return (
      <Banner
        color="default"
        right={
          <Link href={setupLink}>
            <Button size="sm">Ler mais</Button>
          </Link>
        }
      >
        <Icon classes="bg-blue-500 p-1" icon={<AccountTypeIcon />} />
        <span className="text-sm">Sua conta de pagamento está em revisão</span>
      </Banner>
    )
  }

  if (account && !isActive && !isUnderReview) {
    const AccountTypeIcon = ACCOUNT_TYPE_ICON[account.account_type]
    return (
      <Banner
        color="default"
        right={
          <Link href={setupLink}>
            <Button size="sm">Continuar configuração</Button>
          </Link>
        }
      >
        <Icon classes="bg-blue-500 p-1" icon={<AccountTypeIcon />} />
        <span className="text-sm">
          Continue a configuração da sua{' '}
          <strong>{ACCOUNT_TYPE_DISPLAY_NAMES[account.account_type]}</strong>{' '}
          conta para receber pagamentos
        </span>
      </Banner>
    )
  }

  if (account && isActive) {
    const accountType = account.account_type
    const AccountTypeIcon = ACCOUNT_TYPE_ICON[accountType]
    return (
      <>
        <Banner
          color="muted"
          right={
            <>
              <Link href={setupLink}>
                <Button size="sm">Gerenciar</Button>
              </Link>
            </>
          }
        >
          <Icon classes="bg-blue-500 p-1" icon={<AccountTypeIcon />} />
          <span className="dark:text-polar-400 text-sm">
            {accountType === 'stripe' &&
              'Pagamentos serão feitos para a conta Stripe conectada'}
            {accountType === 'open_collective' &&
              'Pagamentos serão feitos em massa uma vez por mês para a conta Open Collective conectada'}
          </span>
        </Banner>
      </>
    )
  }

  return null
}

const UserAccountBanner: React.FC<{
  user: schemas['UserRead']
}> = ({ user }) => {
  const { data: account, isLoading: personalAccountIsLoading } = useAccount(
    user?.account_id,
  )
  const setupLink = '/finance/account'

  if (personalAccountIsLoading) {
    return null
  }

  return <GenericAccountBanner account={account} setupLink={setupLink} />
}

const OrganizationAccountBanner: React.FC<{
  organization: schemas['Organization']
}> = ({ organization }) => {
  const { data: account, isLoading: organizationAccountIsLoading } =
    useOrganizationAccount(organization?.id)
  const setupLink = `/dashboard/${organization.slug}/finance/account`

  if (organizationAccountIsLoading) {
    return null
  }

  return <GenericAccountBanner account={account} setupLink={setupLink} />
}

interface AccountBannerProps {
  organization?: schemas['Organization']
  user?: schemas['UserRead']
}

const AccountBanner: React.FC<AccountBannerProps> = ({
  organization,
  user,
}) => {
  return (
    <>
      {organization && (
        <OrganizationAccountBanner organization={organization} />
      )}
      {user && <UserAccountBanner user={user} />}
    </>
  )
}

export default AccountBanner
