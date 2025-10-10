'use client'

import AccountCreateModal from '@/components/Accounts/AccountCreateModal'
import AccountsList from '@/components/Accounts/AccountsList'
import StreamlinedAccountReview from '@/components/Finance/StreamlinedAccountReview'
import { DashboardBody } from '@/components/Layout/DashboardLayout'
import { Modal } from '@/components/Modal'
import { useModal } from '@/components/Modal/useModal'
import { toast } from '@/components/Toast/use-toast'
import { useAuth } from '@/hooks'
import {
  useCreateIdentityVerification,
  useListAccounts,
  useOrganizationAccount,
} from '@/hooks/queries'
import { schemas } from '@polar-sh/client'
import { ShadowBoxOnMd } from '@polar-sh/ui/components/atoms/ShadowBox'
import { Separator } from '@polar-sh/ui/components/ui/separator'
import { loadStripe } from '@stripe/stripe-js'
import React, { useCallback, useState } from 'react'

export default function ClientPage({
  organization,
}: {
  organization: schemas['Organization']
}) {
  const { currentUser, reloadUser } = useAuth()
  const { data: accounts } = useListAccounts()
  const {
    isShown: isShownSetupModal,
    show: showSetupModal,
    hide: hideSetupModal,
  } = useModal()

  const [requireDetails, setRequireDetails] = useState(
    !organization.details_submitted_at,
  )
  const identityVerificationStatus = currentUser?.identity_verification_status
  const identityVerified = identityVerificationStatus === 'verified'

  const { data: organizationAccount } = useOrganizationAccount(organization.id)

  const [step, setStep] = useState<
    'review' | 'account' | 'identity' | 'complete'
  >(
    !organization.details_submitted_at
      ? 'review'
      : !organizationAccount
        ? 'account'
        : !identityVerified
          ? 'identity'
          : 'complete',
  )

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || '')
  const createIdentityVerification = useCreateIdentityVerification()
  const startIdentityVerification = useCallback(async () => {
    const { data, error } = await createIdentityVerification.mutateAsync()
    if (error) {
      // Handle specific error cases
      const errorDetail = (error as any).detail
      if (
        errorDetail?.error === 'IdentityVerificationProcessing' ||
        errorDetail === 'Sua verificação de identidade ainda está sendo processada.'
      ) {
        toast({
          title: 'Verificação de identidade em andamento',
          description:
            'Sua verificação de identidade já está sendo processada. Por favor, aguarde até que ela seja concluída.',
        })
      } else {
        toast({
          title: 'Erro ao iniciar verificação de identidade',
          description:
            typeof errorDetail === 'string'
              ? errorDetail
              : errorDetail?.detail ||
                'Não foi possível iniciar a verificação de identidade. Por favor, tente novamente.',
        })
      }
      return
    }
    const stripe = await stripePromise
    if (!stripe) {
      toast({
        title: 'Erro ao carregar Stripe',
        description: 'Não foi possível carregar a verificação de identidade. Por favor, tente novamente.',
      })
      return
    }
    const { error: stripeError } = await stripe.verifyIdentity(
      data.client_secret,
    )
    if (stripeError) {
      toast({
        title: 'Erro na verificação de identidade',
        description:
          stripeError.message ||
          'Algo deu errado durante a verificação. Por favor, tente novamente.',
      })
      return
    }
    await reloadUser()
  }, [createIdentityVerification, stripePromise, reloadUser])

  // Auto-advance to next step when details are submitted
  React.useEffect(() => {
    if (organization.details_submitted_at) {
      if (!organizationAccount) {
        setStep('account')
      } else if (!identityVerified) {
        setStep('identity')
      } else {
        setStep('complete')
      }
    }
  }, [organization.details_submitted_at, organizationAccount, identityVerified])

  const handleDetailsSubmitted = useCallback(() => {
    setRequireDetails(false)
    // Stay on review step to show validation UI
  }, [])

  const handleStartAccountSetup = useCallback(() => {
    showSetupModal()
  }, [showSetupModal])

  const handleStartIdentityVerification = useCallback(async () => {
    await startIdentityVerification()
  }, [startIdentityVerification])

  return (
    <DashboardBody>
      <div className="flex flex-col gap-y-6">
        <StreamlinedAccountReview
          organization={organization}
          currentStep={step}
          requireDetails={requireDetails}
          organizationAccount={organizationAccount}
          identityVerified={identityVerified}
          identityVerificationStatus={identityVerificationStatus}
          onDetailsSubmitted={handleDetailsSubmitted}
          onStartAccountSetup={handleStartAccountSetup}
          onStartIdentityVerification={handleStartIdentityVerification}
        />

        {accounts?.items && accounts.items.length > 0 ? (
          <ShadowBoxOnMd>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h2 className="text-lg font-medium">All payout accounts</h2>
                <p className="dark:text-polar-500 text-sm text-gray-500">
                  Payout accounts you manage
                </p>
              </div>
            </div>
            <Separator className="my-8" />
            {accounts?.items && (
              <AccountsList
                accounts={accounts?.items}
                pauseActions={requireDetails}
                returnPath={`/dashboard/${organization.slug}/finance/account`}
              />
            )}
          </ShadowBoxOnMd>
        ) : null}

        <Modal
          isShown={isShownSetupModal}
          className="min-w-[400px]"
          hide={hideSetupModal}
          modalContent={
            <AccountCreateModal
              forOrganizationId={organization.id}
              returnPath={`/dashboard/${organization.slug}/finance/account`}
            />
          }
        />
      </div>
    </DashboardBody>
  )
}
