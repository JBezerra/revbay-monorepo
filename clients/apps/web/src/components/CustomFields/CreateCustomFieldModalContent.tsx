import { useCreateCustomField } from '@/hooks/queries'
import { setValidationErrors } from '@/utils/api/errors'
import { schemas } from '@polar-sh/client'
import Button from '@polar-sh/ui/components/atoms/Button'
import { Form } from '@polar-sh/ui/components/ui/form'
import { useCallback } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from '../Toast/use-toast'
import CustomFieldForm from './CustomFieldForm'

interface CreateCustomFieldModalContentProps {
  organization: schemas['Organization']
  onCustomFieldCreated: (customField: schemas['CustomField']) => void
  hideModal: () => void
}

const CreateCustomFieldModalContent = ({
  organization,
  onCustomFieldCreated,
  hideModal,
}: CreateCustomFieldModalContentProps) => {
  const createCustomField = useCreateCustomField(organization.id)

  const form = useForm<schemas['CustomFieldCreate']>({
    defaultValues: {
      organization_id: organization.id,
      type: 'text',
      properties: {},
    },
  })

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = form

  const onSubmit: SubmitHandler<schemas['CustomFieldCreate']> = useCallback(
    async (customFieldCreate) => {
      const { data: customField, error } =
        await createCustomField.mutateAsync(customFieldCreate)
      if (error) {
        if (error.detail) {
          setValidationErrors(error.detail, setError, 1, [
            'text',
            'number',
            'date',
            'checkbox',
            'select',
          ])
        }
        return
      }
      toast({
        title: 'Campo Personalizado Criado',
        description: `Campo personalizado ${customField.name} foi criado com sucesso`,
      })
      onCustomFieldCreated(customField)
    },
    [createCustomField, onCustomFieldCreated, setError],
  )

  return (
    <div className="flex flex-col gap-y-6 overflow-y-auto px-8 py-10">
      <div>
        <h2 className="text-lg">Criar Campo Personalizado</h2>
        <p className="dark:text-polar-500 mt-2 text-sm text-gray-500">
          Campos Personalizados permitem que você solicite informações
          adicionais dos seus clientes no checkout e estarão disponíveis para
          uso em todos os produtos da sua organização.
        </p>
      </div>
      <div className="flex flex-col gap-y-6">
        <Form {...form}>
          <form
            className="flex flex-col gap-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <CustomFieldForm update={false} />
            {errors.root && (
              <p className="text-destructive-foreground text-sm">
                {errors.root.message}
              </p>
            )}
            <div className="mt-4 flex flex-row items-center gap-x-4">
              <Button
                className="self-start"
                type="submit"
                loading={createCustomField.isPending}
                disabled={createCustomField.isPending}
              >
                Criar
              </Button>
              <Button
                variant="ghost"
                className="self-start"
                onClick={hideModal}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreateCustomFieldModalContent
