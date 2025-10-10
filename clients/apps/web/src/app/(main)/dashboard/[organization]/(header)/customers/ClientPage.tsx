'use client'

import { CreateCustomerModal } from '@/components/Customer/CreateCustomerModal'
import { CustomerPage } from '@/components/Customer/CustomerPage'
import { EditCustomerModal } from '@/components/Customer/EditCustomerModal'
import { DashboardBody } from '@/components/Layout/DashboardLayout'
import { ConfirmModal } from '@/components/Modal/ConfirmModal'
import { InlineModal } from '@/components/Modal/InlineModal'
import { useModal } from '@/components/Modal/useModal'
import Spinner from '@/components/Shared/Spinner'
import { toast } from '@/components/Toast/use-toast'
import { useSafeCopy } from '@/hooks/clipboard'
import { useCustomers, useDeleteCustomer } from '@/hooks/queries'
import { useInViewport } from '@/hooks/utils'
import { api } from '@/utils/client'
import { CONFIG } from '@/utils/config'

import {
  AddOutlined,
  ArrowDownward,
  ArrowUpward,
  MoreVert,
  Search,
} from '@mui/icons-material'
import { schemas } from '@polar-sh/client'
import Avatar from '@polar-sh/ui/components/atoms/Avatar'
import Button from '@polar-sh/ui/components/atoms/Button'
import Input from '@polar-sh/ui/components/atoms/Input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@polar-sh/ui/components/ui/dropdown-menu'
import { parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs'
import React, { useCallback, useEffect, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

const CustomerHeader = ({
  customer,
  organization,
}: {
  customer: schemas['Customer']
  organization: schemas['Organization']
}) => {
  const {
    show: showEditCustomerModal,
    hide: hideEditCustomerModal,
    isShown: isEditCustomerModalOpen,
  } = useModal()

  const {
    show: showDeleteCustomerModal,
    hide: hideDeleteCustomerModal,
    isShown: isDeleteCustomerModalShown,
  } = useModal()

  const safeCopy = useSafeCopy(toast)
  const createCustomerSession = useCallback(async () => {
    const { data: session, error } = await api.POST('/v1/customer-sessions/', {
      body: { customer_id: customer.id },
    })

    if (error) {
      toast({
        title: 'Erro',
        description: `Ocorreu um erro ao criar o link do Portal do Cliente. Por favor, tente novamente mais tarde.`,
      })

      return
    }

    const link = `${CONFIG.FRONTEND_BASE_URL}/${organization.slug}/portal?customer_session_token=${session.token}`
    await safeCopy(link)
    toast({
      title: 'Copiado para a área de transferência',
      description: `Link do Portal do Cliente foi copiado para a área de transferência`,
    })
  }, [safeCopy, customer, organization])

  const deleteCustomer = useDeleteCustomer(
    customer.id,
    customer.organization_id,
  )

  const onDeleteCustomer = useCallback(async () => {
    deleteCustomer.mutateAsync().then((response) => {
      if (response.error) {
        toast({
          title: 'Falha ao Deletar Cliente',
          description: `Erro ao deletar cliente ${customer.email}: ${response.error.detail}`,
        })
        return
      }
      toast({
        title: 'Cliente Deletado',
        description: `Cliente ${customer.email} deletado com sucesso`,
      })
    })
  }, [deleteCustomer, customer])

  return (
    <div className="flex flex-row gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="secondary">
            <MoreVert fontSize="small" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={createCustomerSession}>
            Copiar URL do Portal do Cliente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={showEditCustomerModal}>
            Editar Cliente
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={showDeleteCustomerModal}>
            Deletar Cliente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <InlineModal
        isShown={isEditCustomerModalOpen}
        hide={hideEditCustomerModal}
        modalContent={
          <EditCustomerModal
            customer={customer}
            onClose={hideEditCustomerModal}
          />
        }
      />
      <ConfirmModal
        isShown={isDeleteCustomerModalShown}
        hide={hideDeleteCustomerModal}
        title={`Deletar Cliente "${customer.email}"?`}
        body={
          <div className="dark:text-polar-400 flex flex-col gap-y-2 text-sm leading-relaxed text-gray-500">
            <p>Esta ação não pode ser desfeita e irá imediatamente:</p>
            <ol className="list-inside list-disc pl-4">
              <li>Cancelar todas as assinaturas ativas para o cliente</li>
              <li>Limpar qualquer external_id</li>
            </ol>

            <p>
              No entanto, suas informações ainda serão mantidas para pedidos e assinaturas históricos.
            </p>
          </div>
        }
        onConfirm={onDeleteCustomer}
        confirmPrompt={customer.email}
        destructiveText="Delete"
        destructive
      />
    </div>
  )
}

interface ClientPageProps {
  organization: schemas['Organization']
}

const ClientPage: React.FC<ClientPageProps> = ({ organization }) => {
  const [sorting, setSorting] = useQueryState(
    'sorting',
    parseAsStringLiteral([
      '-created_at',
      'email',
      'created_at',
      '-email',
      'name',
      '-name',
    ] as const).withDefault('-created_at'),
  )
  const [query, setQuery] = useQueryState('query', parseAsString)
  const [selectedCustomerId, setSelectedCustomerId] = useQueryState(
    'customerId',
    parseAsString,
  )

  const { data, fetchNextPage, hasNextPage } = useCustomers(organization.id, {
    query: query ?? undefined,
    sorting: [sorting],
  })

  const customers = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  )

  const selectedCustomer = useMemo(() => {
    if (selectedCustomerId) {
      return customers.find((customer) => customer.id === selectedCustomerId)
    }

    return customers[0]
  }, [customers, selectedCustomerId])

  const {
    show: showCreateCustomerModal,
    hide: hideCreateCustomerModal,
    isShown: isCreateCustomerModalOpen,
  } = useModal()

  const { ref: loadingRef, inViewport } = useInViewport<HTMLDivElement>()

  useEffect(() => {
    if (inViewport && hasNextPage) {
      fetchNextPage()
    }
  }, [inViewport, hasNextPage, fetchNextPage])

  return (
    <DashboardBody
      title={
        selectedCustomer ? (
          <div className="flex flex-row items-center gap-6">
            <Avatar
              avatar_url={selectedCustomer.avatar_url}
              name={selectedCustomer.name || selectedCustomer.email}
              className="h-16 w-16"
            />
            <div className="flex flex-col gap-1">
              <p className="text-lg">
                {(selectedCustomer.name?.length ?? 0) > 0
                  ? selectedCustomer.name
                  : '—'}
              </p>
              <div className="dark:text-polar-500 flex flex-row items-center gap-2 font-mono text-sm text-gray-500">
                <span>{selectedCustomer.email}</span>
              </div>
            </div>
          </div>
        ) : undefined
      }
      header={
        selectedCustomer ? (
          <CustomerHeader
            organization={organization}
            customer={selectedCustomer}
          />
        ) : undefined
      }
      contextViewPlacement="left"
      contextViewClassName="w-full lg:max-w-[320px] xl:max-w-[320px] h-full overflow-y-hidden"
      contextView={
        <div className="dark:divide-polar-800 flex h-full flex-col divide-y divide-gray-200">
          <div className="flex flex-row items-center justify-between gap-6 px-4 py-4">
            <div>Clientes</div>
            <div className="flex flex-row items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() =>
                  setSorting(
                    sorting === '-created_at' ? 'created_at' : '-created_at',
                  )
                }
              >
                {sorting === 'created_at' ? (
                  <ArrowUpward fontSize="small" />
                ) : (
                  <ArrowDownward fontSize="small" />
                )}
              </Button>
              <Button
                size="icon"
                className="h-6 w-6"
                onClick={showCreateCustomerModal}
              >
                <AddOutlined fontSize="small" />
              </Button>
            </div>
          </div>
          <div className="flex flex-row items-center gap-3 px-4 py-2">
            <div className="dark:bg-polar-800 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <Search
                fontSize="inherit"
                className="dark:text-polar-500 text-gray-500"
              />
            </div>
            <Input
              className="w-full rounded-none border-none bg-transparent p-0 !shadow-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
              placeholder="Pesquisar Clientes"
              value={query ?? undefined}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="dark:divide-polar-800 flex h-full flex-grow flex-col divide-y divide-gray-50 overflow-y-auto">
            {customers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => setSelectedCustomerId(customer.id)}
                className={twMerge(
                  'dark:hover:bg-polar-800 cursor-pointer hover:bg-gray-100',
                  selectedCustomer?.id === customer.id &&
                    'dark:bg-polar-800 bg-gray-100',
                )}
              >
                <div className="flex flex-row items-center gap-3 px-4 py-3">
                  <Avatar
                    className="h-8 w-8"
                    avatar_url={customer.avatar_url}
                    name={customer.name || customer.email}
                  />
                  <div className="flex min-w-0 flex-col">
                    <div className="w-full truncate text-sm">
                      {customer.name ?? '—'}
                    </div>
                    <div className="w-full truncate text-xs text-gray-500 dark:text-gray-500">
                      {customer.email}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {hasNextPage && (
              <div
                ref={loadingRef}
                className="flex w-full items-center justify-center py-8"
              >
                <Spinner />
              </div>
            )}
          </div>
        </div>
      }
      wide
    >
      {selectedCustomer ? (
        <CustomerPage customer={selectedCustomer} organization={organization} />
      ) : (
        <div className="mt-96 flex w-full flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-normal">Nenhum Cliente Selecionado</h1>
          <p className="dark:text-polar-500 text-gray-500">
            Selecione um cliente para ver seus detalhes
          </p>
        </div>
      )}
      <InlineModal
        isShown={isCreateCustomerModalOpen}
        hide={hideCreateCustomerModal}
        modalContent={
          <CreateCustomerModal
            organization={organization}
            onClose={hideCreateCustomerModal}
          />
        }
      />
    </DashboardBody>
  )
}

export default ClientPage
