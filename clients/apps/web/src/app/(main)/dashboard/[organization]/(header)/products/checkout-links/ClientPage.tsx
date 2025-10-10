'use client'

import { CheckoutLinkList } from '@/components/CheckoutLinks/CheckoutLinkList'
import { CheckoutLinkManagementModal } from '@/components/CheckoutLinks/CheckoutLinkManagementModal'
import { CheckoutLinkPage } from '@/components/CheckoutLinks/CheckoutLinkPage'
import { DashboardBody } from '@/components/Layout/DashboardLayout'
import { ConfirmModal } from '@/components/Modal/ConfirmModal'
import { InlineModal } from '@/components/Modal/InlineModal'
import { useModal } from '@/components/Modal/useModal'
import { toast } from '@/components/Toast/use-toast'
import { useCheckoutLink, useDeleteCheckoutLink } from '@/hooks/queries'
import { OrganizationContext } from '@/providers/maintainerOrganization'
import {
  AddOutlined,
  LinkOutlined,
  MoreVertOutlined,
} from '@mui/icons-material'
import Button from '@polar-sh/ui/components/atoms/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@polar-sh/ui/components/ui/dropdown-menu'
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'
import { useContext } from 'react'

export const ClientPage = () => {
  const [productIds, setProductIds] = useQueryState(
    'productId',
    parseAsArrayOf(parseAsString),
  )
  const [selectedCheckoutLinkId, setSelectedCheckoutLinkId] = useQueryState(
    'checkoutLinkId',
    parseAsString,
  )

  const { organization } = useContext(OrganizationContext)

  const { data: checkoutLink } = useCheckoutLink(selectedCheckoutLinkId)

  const { mutateAsync: deleteCheckoutLink, isPending: isDeletePending } =
    useDeleteCheckoutLink()

  const {
    isShown: isDeleteModalShown,
    show: showDeleteModal,
    hide: hideDeleteModal,
  } = useModal()

  const {
    show: showCreateCheckoutLinkModal,
    hide: hideCreateCheckoutLinkModal,
    isShown: isCreateCheckoutLinkModalOpen,
  } = useModal()

  const onDelete = async () => {
    if (checkoutLink) {
      await deleteCheckoutLink(checkoutLink).then(({ error }) => {
        if (error) {
          toast({
            title: 'Falha na Deleção do Link de Checkout',
            description: `Erro ao deletar link de checkout: ${error.detail}`,
          })
          return
        }

        toast({
          title: 'Link de Checkout Deletado',
          description: `${
            checkoutLink?.label ? checkoutLink.label : 'Sem Label'
          } Link de Checkout foi deletado com sucesso`,
        })

        setSelectedCheckoutLinkId(null)
        setProductIds([])
      })
    }
  }

  return (
    <DashboardBody
      className="flex flex-col gap-y-8"
      contextViewClassName="w-full lg:max-w-[320px] xl:max-w-[320px] h-full overflow-y-hidden"
      contextView={
        <CheckoutLinkList
          productIds={productIds}
          setProductIds={setProductIds}
          selectedCheckoutLinkId={selectedCheckoutLinkId}
          setSelectedCheckoutLinkId={setSelectedCheckoutLinkId}
          showCreateCheckoutLinkModal={showCreateCheckoutLinkModal}
        />
      }
      contextViewPlacement="left"
      title={checkoutLink?.label ?? ''}
      header={
        checkoutLink ? (
          <div className="flex flex-row items-center gap-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none" asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  loading={isDeletePending}
                >
                  <MoreVertOutlined fontSize="inherit" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="dark:bg-polar-800 bg-gray-50 shadow-lg"
              >
                <DropdownMenuItem onClick={showDeleteModal}>
                  Deletar Link de Checkout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : undefined
      }
      wrapperClassName="!max-w-screen-sm"
    >
      {checkoutLink ? (
        <>
          <CheckoutLinkPage checkoutLink={checkoutLink} />
          <ConfirmModal
            title="Confirmar Deleção do Link de Checkout"
            description="Isso causará respostas 404 caso o link ainda esteja em uso em algum lugar."
            onConfirm={onDelete}
            isShown={isDeleteModalShown}
            hide={hideDeleteModal}
            confirmPrompt={checkoutLink.label ?? ''}
            destructiveText="Deletar"
            destructive
          />
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center pt-32">
          <div className="flex flex-col items-center justify-center gap-y-8">
            <LinkOutlined fontSize="large" />
            <div className="flex flex-col items-center justify-center gap-y-2">
              <h3 className="text-xl">Nenhum Link de Checkout Selecionado</h3>
              <p className="dark:text-polar-500 text-gray-500">
                Crie um novo link de checkout para compartilhar com seus clientes
              </p>
            </div>
            <Button onClick={showCreateCheckoutLinkModal}>
              <AddOutlined fontSize="small" className="mr-2" />
                Novo Link
            </Button>
          </div>
        </div>
      )}
      <InlineModal
        isShown={isCreateCheckoutLinkModalOpen}
        hide={hideCreateCheckoutLinkModal}
        modalContent={
          <CheckoutLinkManagementModal
            organization={organization}
            productIds={productIds ?? []}
            onClose={(checkoutLink) => {
              setSelectedCheckoutLinkId(checkoutLink.id)
              setProductIds([])
              hideCreateCheckoutLinkModal()
            }}
          />
        }
      />
    </DashboardBody>
  )
}
