import { MiniMetricChartBox } from '@/components/Metrics/MiniMetricChartBox'
import { OrderStatus } from '@/components/Orders/OrderStatus'
import RevenueWidget from '@/components/Widgets/RevenueWidget'
import { useOrders } from '@/hooks/queries/orders'
import { schemas } from '@polar-sh/client'
import Avatar from '@polar-sh/ui/components/atoms/Avatar'
import Button from '@polar-sh/ui/components/atoms/Button'
import {
  DataTable,
  DataTableColumnHeader,
} from '@polar-sh/ui/components/atoms/DataTable'
import FormattedDateTime from '@polar-sh/ui/components/atoms/FormattedDateTime'
import { formatCurrencyAndAmount } from '@polar-sh/ui/lib/money'
import Link from 'next/link'

export interface ProductOverviewProps {
  organization: schemas['Organization']
  product: schemas['Product']
  metrics?: schemas['MetricsResponse']
  todayMetrics?: schemas['MetricsResponse']
}

export const ProductOverview = ({
  organization,
  product,
  metrics,
  todayMetrics,
}: ProductOverviewProps) => {
  const { data: productOrders, isLoading: productOrdersIsLoading } = useOrders(
    organization.id,
    {
      product_id: product.id,
      limit: 10,
    },
  )

  return (
    <div className="flex flex-col gap-y-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MiniMetricChartBox
          title="Pedidos"
          metric={metrics?.metrics.orders}
          value={metrics?.periods.reduce(
            (acc, current) => acc + current.orders,
            0,
          )}
        />
        <MiniMetricChartBox
          title="Receita de Hoje"
          metric={todayMetrics?.metrics.revenue}
          value={todayMetrics?.periods[todayMetrics.periods.length - 1].revenue}
        />
        <MiniMetricChartBox
          title="Receita Acumulada"
          metric={metrics?.metrics.cumulative_revenue}
          value={
            metrics?.periods[metrics?.periods.length - 1].cumulative_revenue
          }
        />
      </div>
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-row items-center justify-between gap-x-6">
          <div className="flex flex-col gap-y-1">
            <h2 className="text-lg">Pedidos do Produto</h2>
            <p className="dark:text-polar-500 text-sm text-gray-500">
              Mostrando os últimos 10 pedidos para {product.name}
            </p>
          </div>
          <Link
            href={`/dashboard/${organization.slug}/sales?product_id=${product.id}`}
          >
            <Button size="sm">Ver Todos</Button>
          </Link>
        </div>
        <DataTable
          data={productOrders?.items ?? []}
          columns={[
            {
              accessorKey: 'customer',
              enableSorting: true,
              header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Customer" />
              ),
              cell: (props) => {
                const customer = props.getValue() as schemas['OrderCustomer']
                return (
                  <div className="flex flex-row items-center gap-2">
                    <Avatar
                      className="h-8 w-8"
                      avatar_url={customer.avatar_url}
                      name={customer.name || customer.email}
                    />
                    <div className="fw-medium truncate">{customer.email}</div>
                  </div>
                )
              },
            },
            {
              accessorKey: 'amount',
              enableSorting: true,
              header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Valor" />
              ),
              cell: ({ row: { original: order } }) => (
                <span>
                  {formatCurrencyAndAmount(order.net_amount, order.currency)}
                </span>
              ),
            },
            {
              accessorKey: 'status',
              enableSorting: true,
              header: ({ column }) => (
                <DataTableColumnHeader
                  column={column}
                  title="Status do Pedido"
                />
              ),
              cell: ({ row: { original: order } }) => (
                <span className="flex flex-shrink">
                  <OrderStatus status={order.status} />
                </span>
              ),
            },
            {
              accessorKey: 'created_at',
              enableSorting: true,
              header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Data" />
              ),
              cell: (props) => (
                <FormattedDateTime datetime={props.getValue() as string} />
              ),
            },
            {
              accessorKey: 'actions',
              enableSorting: true,
              header: () => null,
              cell: (props) => (
                <span className="flex flex-row justify-end">
                  <Link
                    href={`/dashboard/${organization.slug}/sales/${props.row.original.id}`}
                  >
                    <Button variant="secondary" size="sm">
                      Visualizar
                    </Button>
                  </Link>
                </span>
              ),
            },
          ]}
          isLoading={productOrdersIsLoading}
        />
      </div>
      <RevenueWidget productId={product.id} />
    </div>
  )
}
