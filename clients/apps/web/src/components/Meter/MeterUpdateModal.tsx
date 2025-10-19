import { useMeter, useUpdateMeter } from '@/hooks/queries/meters'
import { setValidationErrors } from '@/utils/api/errors'
import { isValidationError, schemas } from '@polar-sh/client'
import Button from '@polar-sh/ui/components/atoms/Button'
import { Form } from '@polar-sh/ui/components/ui/form'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Well, WellContent, WellHeader } from '../Shared/Well'
import { useToast } from '../Toast/use-toast'
import MeterForm from './MeterForm'

export interface MeterUpdateModalProps {
  meter: schemas['Meter']
  hide: () => void
  hasProcessedEvents: boolean
}

export const MeterUpdateModal = ({
  meter: _meter,
  hide,
  hasProcessedEvents,
}: MeterUpdateModalProps) => {
  const { data: meter } = useMeter(_meter.id, _meter)
  const form = useForm<schemas['MeterUpdate']>({
    defaultValues: {
      ...meter,
    },
  })

  const { handleSubmit, setError } = form
  const updateMeter = useUpdateMeter(_meter.id)
  const { toast } = useToast()

  const onSubmit = useCallback(
    async (body: schemas['MeterUpdate']) => {
      const { data: meter, error } = await updateMeter.mutateAsync(body)

      if (error) {
        if (isValidationError(error.detail)) {
          setValidationErrors(error.detail, setError)
        } else {
          setError('root', { message: error.detail })
        }
        return
      }
      toast({
        title: `Métrica ${meter.name} atualizada`,
        description: `Métrica atualizada com sucesso.`,
      })

      hide()
    },
    [updateMeter, hide, toast, setError],
  )

  if (!meter) return null

  return (
    <div className="flex flex-col gap-8 overflow-y-auto px-8 py-12">
      <h2 className="text-xl">Editar Métrica</h2>
      <p className="dark:text-polar-500 text-gray-500">
        Métricas são agregações de eventos. Você pode criar uma métrica para
        rastrear eventos que correspondem a um filtro.
      </p>
      <div className="flex flex-col gap-y-6">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-8"
          >
            <MeterForm />
            {hasProcessedEvents && (
              <Well className="gap-y-2 rounded-2xl p-6">
                <WellHeader>Atualizar Métrica</WellHeader>
                <WellContent>
                  <p className="dark:text-polar-500 text-sm text-gray-500">
                    Uma vez que uma métrica processou eventos, seus filtros ou
                    função de agregação não podem ser alterados.
                  </p>
                </WellContent>
              </Well>
            )}

            <div className="flex flex-row items-center gap-4">
              <Button
                type="submit"
                loading={updateMeter.isPending}
                disabled={hasProcessedEvents}
              >
                Atualizar Métrica
              </Button>
              <Button variant="secondary" onClick={hide}>
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
