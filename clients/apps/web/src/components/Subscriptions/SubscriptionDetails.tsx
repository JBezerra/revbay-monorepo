'use client'

import { schemas } from '@polar-sh/client'
import FormattedDateTime from '@polar-sh/ui/components/atoms/FormattedDateTime'
import TextArea from '@polar-sh/ui/components/atoms/TextArea'
import { formatCurrencyAndAmount } from '@polar-sh/ui/lib/money'
import { DetailRow } from '../Shared/DetailRow'
import { SubscriptionStatus } from './SubscriptionStatus'

const CANCELLATION_REASONS: {
  [key: string]: string
} = {
  unused: 'Não Utilizado',
  too_expensive: 'Muito Caro',
  missing_features: 'Faltando Funcionalidades',
  switched_service: 'Mudou de Serviço',
  customer_service: 'Suporte ao Cliente',
  low_quality: 'Qualidade Baixa',
  too_complex: 'Muito Complexo',
  other: 'Outro',
}

const getHumanCancellationReason = (key: string | null) => {
  if (key && key in CANCELLATION_REASONS) {
    return CANCELLATION_REASONS[key]
  }
  return null
}

interface SubscriptionDetailsProps {
  subscription: schemas['Subscription']
}

const SubscriptionDetails = ({ subscription }: SubscriptionDetailsProps) => {
  const cancellationReason = subscription.customer_cancellation_reason
  const cancellationComment = subscription.customer_cancellation_comment

  let nextEventDatetime: string | undefined = undefined
  let cancellationDate: Date | undefined = undefined
  if (subscription.ended_at) {
    cancellationDate = new Date(subscription.ended_at)
  } else if (subscription.ends_at) {
    nextEventDatetime = subscription.ends_at
    cancellationDate = new Date(subscription.ends_at)
  } else if (subscription.current_period_end) {
    nextEventDatetime = subscription.current_period_end
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <DetailRow
          label="ID da Assinatura"
          value={subscription.id}
          valueClassName="font-mono text-sm"
        />
        <DetailRow
          label="Status da Assinatura"
          value={<SubscriptionStatus subscription={subscription} />}
        />
        <DetailRow
          label="Data de Início"
          value={<FormattedDateTime datetime={subscription.created_at} />}
        />

        {nextEventDatetime && (
          <DetailRow
            label={subscription.ends_at ? 'Data de Fim' : 'Data de Renovação'}
            value={<FormattedDateTime datetime={nextEventDatetime} />}
          />
        )}

        {subscription.ended_at && (
          <DetailRow
            label="Data de Fim"
            value={<FormattedDateTime datetime={subscription.ended_at} />}
          />
        )}

        <DetailRow
          label="Intervalo de Renovação"
          value={subscription.recurring_interval === 'month' ? 'Mês' : 'Ano'}
        />

        <DetailRow
          label="Desconto"
          value={subscription.discount ? subscription.discount.code : '—'}
        />

        <DetailRow
          label="Valor"
          value={
            subscription.amount
              ? formatCurrencyAndAmount(subscription.amount)
              : '—'
          }
        />
      </div>

      {cancellationDate && (
        <div className="flex flex-col gap-y-4">
          <h3 className="text-lg">Detalhes de Cancelamento</h3>
          <div className="flex flex-col gap-y-2">
            <DetailRow
              label="Data de Fim"
              value={cancellationDate.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            />

            <DetailRow
              label="Motivo"
              value={
                cancellationReason
                  ? getHumanCancellationReason(cancellationReason)
                  : '—'
              }
            />
          </div>
          {cancellationComment && (
            <TextArea tabIndex={-1} readOnly resizable={false}>
              {cancellationComment}
            </TextArea>
          )}
        </div>
      )}
    </>
  )
}

export default SubscriptionDetails
