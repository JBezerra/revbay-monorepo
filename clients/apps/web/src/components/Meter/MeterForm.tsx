'use client'

import MeterFilterInput from '@/components/Meter/MeterFilterInput'
import { enums, schemas } from '@polar-sh/client'
import Input from '@polar-sh/ui/components/atoms/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@polar-sh/ui/components/atoms/Select'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@polar-sh/ui/components/ui/form'
import { useFormContext } from 'react-hook-form'

const AGGREGATION_FUNCTIONS = [
  ...enums.countAggregationFuncValues,
  ...enums.propertyAggregationFuncValues,
]

export const AGGREGATION_FUNCTION_DISPLAY_NAMES: Record<
  (typeof AGGREGATION_FUNCTIONS)[number],
  string
> = {
  count: 'Contagem',
  sum: 'Soma',
  avg: 'Média',
  min: 'Mínimo',
  max: 'Máximo',
}

const MeterForm = ({ eventNames }: { eventNames?: schemas['EventName'][] }) => {
  const form = useFormContext<schemas['MeterCreate']>()
  const { control, watch } = form
  const aggregationFunction = watch('aggregation.func')

  return (
    <>
      <FormField
        control={control}
        name="name"
        rules={{
          minLength: {
            value: 3,
            message: 'Este campo deve ter pelo menos 3 caracteres',
          },
          required: 'Este campo é obrigatório',
        }}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormDescription>
                Será mostrado nas faturas e no uso do cliente.
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ''}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />

      <FormItem>
        <FormLabel>Filtros</FormLabel>
        <FormDescription>
          Especifique como eventos são filtrados antes de serem agregados.
        </FormDescription>
        <MeterFilterInput eventNames={eventNames} prefix="filter" />
        <FormMessage />
      </FormItem>
      <FormItem>
        <FormLabel>Agregação</FormLabel>
        <FormDescription>
          A função que transformará os eventos filtrados em valores de unidade.
        </FormDescription>
        <div className="flex flex-row items-center gap-x-4">
          <FormField
            control={control}
            name="aggregation.func"
            rules={{
              required: 'Este campo é obrigatório',
            }}
            render={({ field }) => {
              return (
                <FormItem className="flex-1">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma função de agregação" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(AGGREGATION_FUNCTION_DISPLAY_NAMES).map(
                        ([func, displayName]) => (
                          <SelectItem key={func} value={func}>
                            {displayName}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )
            }}
          />
          {aggregationFunction !== 'count' && (
            <FormField
              control={control}
              name="aggregation.property"
              rules={{
                required: 'Este campo é obrigatório',
              }}
              render={({ field }) => {
                return (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="Propriedade"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          )}
        </div>
      </FormItem>
    </>
  )
}

export default MeterForm
