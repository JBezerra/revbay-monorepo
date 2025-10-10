'use client'

import { CustomerEventsView } from '@/components/Customer/CustomerEventsView'
import { CustomerUsageView } from '@/components/Customer/CustomerUsageView'
import AmountLabel from '@/components/Shared/AmountLabel'
import { SubscriptionStatusLabel } from '@/components/Subscriptions/utils'
import { useListSubscriptions, useMetrics } from '@/hooks/queries'
import { useOrders } from '@/hooks/queries/orders'
import { getChartRangeParams } from '@/utils/metrics'
import { AddOutlined } from '@mui/icons-material'
import { schemas } from '@polar-sh/client'
import Button from '@polar-sh/ui/components/atoms/Button'
import { DataTable } from '@polar-sh/ui/components/atoms/DataTable'
import FormattedDateTime from '@polar-sh/ui/components/atoms/FormattedDateTime'
import ShadowBox from '@polar-sh/ui/components/atoms/ShadowBox'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@polar-sh/ui/components/atoms/Tabs'
import Link from 'next/link'
import React from 'react'
import MetricChartBox from '../Metrics/MetricChartBox'
import { InlineModal } from '../Modal/InlineModal'
import { useModal } from '../Modal/useModal'
import { DetailRow } from '../Shared/DetailRow'
import { EditCustomerModal } from './EditCustomerModal'

interface CustomerPageProps {
  organization: schemas['Organization']
  customer: schemas['Customer']
}

export const CustomerPage: React.FC<CustomerPageProps> = ({
  organization,
  customer,
}) => {
  const { data: orders, isLoading: ordersLoading } = useOrders(
    customer.organization_id,
    {
      customer_id: customer.id,
      limit: 999,
      sorting: ['-created_at'],
    },
  )

  const { data: subscriptions, isLoading: subscriptionsLoading } =
    useListSubscriptions(customer.organization_id, {
      customer_id: customer.id,
      limit: 999,
      sorting: ['-started_at'],
    })

  const [selectedMetric, setSelectedMetric] =
    React.useState<keyof schemas['Metrics']>('revenue')
  const [startDate, endDate, interval] = React.useMemo(
    () => getChartRangeParams('all_time', customer.created_at),
    [customer.created_at],
  )
  const { data: metricsData, isLoading: metricsLoading } = useMetrics({
    startDate,
    endDate,
    organization_id: organization.id,
    interval,
    customer_id: [customer.id],
  })

  const {
    isShown: isEditCustomerModalShown,
    show: showEditCustomerModal,
    hide: hideEditCustomerModal,
  } = useModal()

  return (
    <Tabs defaultValue="overview" className="flex flex-col">
      <TabsList className="mb-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="events">Eventos</TabsTrigger>
        <TabsTrigger value="usage">Uso</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="flex flex-col gap-y-12">
        <MetricChartBox
          metric={selectedMetric}
          onMetricChange={setSelectedMetric}
          interval={interval}
          data={metricsData}
          loading={metricsLoading}
        />
        <div className="flex flex-col gap-4">
          <h3 className="text-lg">Assinaturas</h3>
          <DataTable
            data={subscriptions?.items ?? []}
            columns={[
              {
                header: 'Nome do Produto',
                accessorKey: 'product.name',
                cell: ({ row: { original } }) => (
                  <span>{original.product.name}</span>
                ),
              },
              {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row: { original } }) => (
                  <SubscriptionStatusLabel
                    className="text-xs"
                    subscription={original}
                  />
                ),
              },
              {
                header: 'Valor',
                accessorKey: 'amount',
                cell: ({ row: { original } }) =>
                  original.amount && original.currency ? (
                    <AmountLabel
                      amount={original.amount}
                      currency={original.currency}
                      interval={original.recurring_interval}
                    />
                  ) : (
                    <span>—</span>
                  ),
              },
              {
                header: '',
                accessorKey: 'action',
                cell: ({ row: { original } }) => (
                  <div className="flex justify-end">
                    <Link
                      href={`/dashboard/${organization.slug}/sales/subscriptions/${original.id}`}
                    >
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ),
              },
            ]}
            isLoading={subscriptionsLoading}
            className="text-sm"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg">Pedidos</h3>

          <DataTable
            data={orders?.items ?? []}
            columns={[
              {
                header: 'Nome do Produto',
                accessorKey: 'product.name',
                cell: ({ row: { original } }) => (
                  <Link
                    href={`/dashboard/${organization?.slug}/sales/${original.id}`}
                    key={original.id}
                  >
                    <span>{original.product.name}</span>
                  </Link>
                ),
              },
              {
                header: 'Criado em',
                accessorKey: 'created_at',
                cell: ({ row: { original } }) => (
                  <span className="dark:text-polar-500 text-xs text-gray-500">
                    <FormattedDateTime datetime={original.created_at} />
                  </span>
                ),
              },
              {
                header: 'Valor',
                accessorKey: 'amount',
                cell: ({ row: { original } }) => (
                  <AmountLabel
                    amount={original.net_amount}
                    currency={original.currency}
                  />
                ),
              },
              {
                header: '',
                accessorKey: 'action',
                cell: ({ row: { original } }) => (
                  <div className="flex justify-end">
                    <Link
                      href={`/dashboard/${organization.slug}/sales/${original.id}`}
                    >
                      <Button variant="secondary" size="sm">
                        Visualizar
                      </Button>
                    </Link>
                  </div>
                ),
              },
            ]}
            isLoading={ordersLoading}
            className="text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <ShadowBox className="flex flex-col gap-8">
            <h2 className="text-xl">Detalhes do Cliente</h2>
            <div className="flex flex-col">
              <DetailRow label="ID" value={customer.id} />
              <DetailRow label="ID Externo" value={customer.external_id} />
              <DetailRow label="Email" value={customer.email} />
              <DetailRow label="Nome" value={customer.name} />
              <DetailRow
                label="Tax ID"
                value={customer.tax_id ? customer.tax_id[0] : null}
              />
              <DetailRow
                label="Criado em"
                value={<FormattedDateTime datetime={customer.created_at} />}
              />
            </div>
            <h4 className="text-lg">Endereço de Cobrança</h4>
            <div className="flex flex-col">
              <DetailRow
                label="Rua"
                value={customer.billing_address?.line1}
              />
              <DetailRow
                label="Complemento"
                value={customer.billing_address?.line2}
              />
              <DetailRow label="Cidade" value={customer.billing_address?.city} />
              <DetailRow
                label="Estado"
                value={customer.billing_address?.state}
              />
              <DetailRow
                  label="CEP"
                value={customer.billing_address?.postal_code}
              />
              <DetailRow
                label="País"
                value={customer.billing_address?.country}
              />
            </div>
          </ShadowBox>
          <ShadowBox className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between gap-2">
                <h3 className="text-lg">Metadados</h3>
              <Button
                className="h-6 w-6"
                size="icon"
                onClick={showEditCustomerModal}
              >
                <AddOutlined />
              </Button>
            </div>
            {Object.entries(customer.metadata).map(([key, value]) => (
              <DetailRow
                key={key}
                label={key}
                value={value}
                valueClassName="dark:bg-polar-800 bg-gray-100"
              />
            ))}
          </ShadowBox>
        </div>
      </TabsContent>
      <CustomerUsageView customer={customer} />
      <TabsContent value="events">
        <CustomerEventsView customer={customer} organization={organization} />
      </TabsContent>
      <InlineModal
        isShown={isEditCustomerModalShown}
        hide={hideEditCustomerModal}
        modalContent={
          <EditCustomerModal
            customer={customer}
            onClose={hideEditCustomerModal}
          />
        }
      />
    </Tabs>
  )
}
