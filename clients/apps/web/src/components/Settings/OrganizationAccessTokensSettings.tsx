'use client'

import { InlineModal, InlineModalHeader } from '@/components/Modal/InlineModal'
import { useModal } from '@/components/Modal/useModal'
import {
  useCreateOrganizationAccessToken,
  useDeleteOrganizationAccessToken,
  useOrganizationAccessTokens,
  useUpdateOrganizationAccessToken,
} from '@/hooks/queries'
import { enums, schemas } from '@polar-sh/client'
import Button from '@polar-sh/ui/components/atoms/Button'
import CopyToClipboardInput from '@polar-sh/ui/components/atoms/CopyToClipboardInput'
import Input from '@polar-sh/ui/components/atoms/Input'
import ShadowListGroup from '@polar-sh/ui/components/atoms/ShadowListGroup'
import Banner from '@polar-sh/ui/components/molecules/Banner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@polar-sh/ui/components/ui/form'
import { useCallback, useState } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import { ConfirmModal } from '../Modal/ConfirmModal'
import { toast, useToast } from '../Toast/use-toast'

interface AccessTokenCreate {
  comment: string
  expires_in: string | null | 'no-expiration'
  scopes: Array<schemas['AvailableScope']>
}

interface AccessTokenUpdate {
  comment: string
  scopes: Array<schemas['AvailableScope']>
}

const AccessTokenForm = () => {
  const { control } = useFormContext<AccessTokenCreate | AccessTokenUpdate>()

  return (
    <>
      <FormField
        control={control}
        name="comment"
        rules={{
          required: 'Um nome é obrigatório',
        }}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              <FormLabel>Nome</FormLabel>
            </div>
            <FormControl>
              <Input {...field} placeholder="E.g app-production" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

interface CreateAccessTokenModalProps {
  organization: schemas['Organization']
  onSuccess: (token: schemas['OrganizationAccessTokenCreateResponse']) => void
  onHide: () => void
}

const CreateAccessTokenModal = ({
  organization,
  onSuccess,
  onHide,
}: CreateAccessTokenModalProps) => {
  const createToken = useCreateOrganizationAccessToken(organization.id)
  const form = useForm<AccessTokenCreate>({
    defaultValues: {
      comment: '',
      expires_in: 'P30D',
      scopes: [],
    },
  })
  const { handleSubmit, reset } = form

  const onCreate = useCallback(
    async (data: AccessTokenCreate) => {
      const { data: created } = await createToken.mutateAsync({
        comment: data.comment ? data.comment : '',
        expires_in: null,
        scopes: enums.availableScopeValues as Array<schemas['AvailableScope']>,
      })
      if (created) {
        onSuccess(created)
        reset({ scopes: [] })
        createToken.reset()
      }
    },
    [createToken, onSuccess, reset],
  )

  return (
    <div className="flex flex-col overflow-y-auto">
      <InlineModalHeader hide={onHide}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl">Criar API Key</h2>
        </div>
      </InlineModalHeader>
      <div className="flex flex-col gap-y-8 p-8">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onCreate)}
            className="max-w-[700px] space-y-8"
          >
            <AccessTokenForm />
            <Button type="submit">Criar</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

interface UpdateAccessTokenModalProps {
  token: schemas['OrganizationAccessToken']
  onSuccess: (token: schemas['OrganizationAccessToken']) => void
  onHide: () => void
}

const UpdateAccessTokenModal = ({
  token,
  onSuccess,
  onHide,
}: UpdateAccessTokenModalProps) => {
  const updateToken = useUpdateOrganizationAccessToken(token.id)
  const form = useForm<AccessTokenUpdate>({
    defaultValues: {
      ...token,
      scopes: token.scopes as schemas['AvailableScope'][],
    },
  })
  const { handleSubmit } = form
  const { toast } = useToast()

  const onUpdate = useCallback(
    async (data: AccessTokenUpdate) => {
      const { data: updated } = await updateToken.mutateAsync({
        comment: data.comment ? data.comment : '',
        scopes: data.scopes,
      })
      if (updated) {
        onSuccess(updated)
        toast({
          title: 'API Key Atualizada',
          description: `API Key ${updated.comment} foi atualizada com sucesso`,
        })
      }
    },
    [updateToken, onSuccess, toast],
  )

  return (
    <div className="flex flex-col overflow-y-auto">
      <InlineModalHeader hide={onHide}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl">Atualizar API Key</h2>
        </div>
      </InlineModalHeader>
      <div className="flex flex-col gap-y-8 p-8">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onUpdate)}
            className="max-w-[700px] space-y-8"
          >
            <AccessTokenForm />
            <Button type="submit">Atualizar</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

const AccessTokenItem = ({
  token,
  rawToken,
}: {
  token: schemas['OrganizationAccessToken']
  rawToken?: string
}) => {
  const {
    isShown: updateModalShown,
    show: showUpdateModal,
    hide: hideUpdateModal,
  } = useModal()

  const {
    isShown: deleteModalShown,
    show: showDeleteModal,
    hide: hideDeleteModal,
  } = useModal()

  const deleteToken = useDeleteOrganizationAccessToken()

  const onDelete = useCallback(async () => {
    deleteToken.mutateAsync(token).then(({ error }) => {
      if (error) {
        toast({
          title: 'Falha ao deletar API Key',
          description: `Erro ao deletar API Key: ${error.detail}`,
        })
        return
      }
      toast({
        title: 'API Key Deletada',
        description: `API Key ${token.comment} foi deletada com sucesso`,
      })
    })
  }, [token, deleteToken])

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row">
          <div className="gap-y flex flex-col">
            <h3 className="text-md">{token.comment}</h3>
          </div>
        </div>{' '}
        <div className="dark:text-polar-400 flex flex-row items-center gap-2 text-gray-500">
          <Button onClick={showUpdateModal} size="sm">
            Atualizar
          </Button>
          <Button onClick={showDeleteModal} variant="destructive" size="sm">
            Revogar
          </Button>
        </div>
      </div>
      {rawToken && (
        <>
          <CopyToClipboardInput
            value={rawToken}
            buttonLabel="Copiar"
            onCopy={() => {
              toast({
                title: 'Copiado para a área de transferência',
                description: `API Key foi copiada para a área de transferência`,
              })
            }}
          />
          <Banner color="blue">
            <span className="text-sm">
              Copie a API key e salve em um local seguro. Você não poderá ver
              novamente.
            </span>
          </Banner>
        </>
      )}
      <InlineModal
        isShown={updateModalShown}
        hide={hideUpdateModal}
        modalContent={
          <UpdateAccessTokenModal
            token={token}
            onSuccess={hideUpdateModal}
            onHide={hideUpdateModal}
          />
        }
      />
      <ConfirmModal
        isShown={deleteModalShown}
        hide={hideDeleteModal}
        onConfirm={onDelete}
        title="Revogar API Key"
        description="Isso irá deletar permanentemente sua API key."
        destructive
        destructiveText="Revoke"
        confirmPrompt={token.comment}
      />
    </div>
  )
}

const OrganizationAccessTokensSettings = ({
  organization,
}: {
  organization: schemas['Organization']
}) => {
  const tokens = useOrganizationAccessTokens(organization.id)
  const [createdToken, setCreatedToken] =
    useState<schemas['OrganizationAccessTokenCreateResponse']>()

  const {
    isShown: createModalShown,
    show: showCreateModal,
    hide: hideCreateModal,
  } = useModal()

  const onCreate = (
    token: schemas['OrganizationAccessTokenCreateResponse'],
  ) => {
    hideCreateModal()
    setCreatedToken(token)
  }

  return (
    <div className="flex w-full flex-col">
      <ShadowListGroup>
        {tokens.data?.items && tokens.data.items.length > 0 ? (
          tokens.data?.items.map((token) => {
            const isNewToken =
              token.id === createdToken?.organization_access_token.id

            return (
              <ShadowListGroup.Item key={token.id}>
                <AccessTokenItem
                  token={token}
                  rawToken={isNewToken ? createdToken?.token : undefined}
                />
              </ShadowListGroup.Item>
            )
          })
        ) : (
          <ShadowListGroup.Item>
            <p className="dark:text-polar-400 text-sm text-gray-500">
              Você não tem nenhuma API Key ativa.
            </p>
          </ShadowListGroup.Item>
        )}
        <ShadowListGroup.Item>
          <div className="flex flex-row items-center gap-x-4">
            <Button asChild onClick={showCreateModal} size="sm">
              Criar API Key
            </Button>
          </div>
        </ShadowListGroup.Item>
        <InlineModal
          isShown={createModalShown}
          hide={hideCreateModal}
          modalContent={
            <CreateAccessTokenModal
              organization={organization}
              onSuccess={onCreate}
              onHide={hideCreateModal}
            />
          }
        />
      </ShadowListGroup>
    </div>
  )
}

export default OrganizationAccessTokensSettings
