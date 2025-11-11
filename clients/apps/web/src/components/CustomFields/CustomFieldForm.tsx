import { ClearOutlined } from '@mui/icons-material'
import { enums, schemas } from '@polar-sh/client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@polar-sh/ui/components/atoms/Accordion'
import Button from '@polar-sh/ui/components/atoms/Button'
import Input from '@polar-sh/ui/components/atoms/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@polar-sh/ui/components/atoms/Select'
import Switch from '@polar-sh/ui/components/atoms/Switch'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@polar-sh/ui/components/ui/form'
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import CustomFieldTypeLabel from './CustomFieldTypeLabel'

const CustomFieldTextProperties = () => {
  const { control } = useFormContext<
    (schemas['CustomFieldCreate'] | schemas['CustomFieldUpdate']) & {
      type: 'text'
    }
  >()
  return (
    <>
      <FormField
        control={control}
        name="properties.min_length"
        rules={{
          min: {
            value: 0,
            message: 'This field must be a positive number',
          },
        }}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Comprimento mínimo</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <FormField
        control={control}
        name="properties.max_length"
        rules={{
          min: {
            value: 0,
            message: 'This field must be a positive number',
          },
        }}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Comprimento máximo</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </>
  )
}

const CustomFieldComparableProperties = () => {
  const { control } = useFormContext<
    (schemas['CustomFieldCreate'] | schemas['CustomFieldUpdate']) & {
      type: 'number' | 'datetime'
    }
  >()
  return (
    <>
      <FormField
        control={control}
        name="properties.ge"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Maior ou igual a</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <FormField
        control={control}
        name="properties.le"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Menor ou igual a</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </>
  )
}

const CustomFieldSelectProperties = () => {
  const { control } = useFormContext<
    (schemas['CustomFieldCreate'] | schemas['CustomFieldUpdate']) & {
      type: 'select'
    }
  >()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'properties.options',
    rules: {
      minLength: 1,
    },
  })
  return (
    <FormItem>
      <FormLabel>Opções de seleção</FormLabel>
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-row items-center gap-2">
            <FormField
              control={control}
              name={`properties.options.${index}.value`}
              render={({ field }) => (
                <div className="flex flex-col">
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder="Valor"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={control}
              name={`properties.options.${index}.label`}
              render={({ field }) => (
                <div className="flex flex-col">
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder="Rótulo"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <Button
              className={
                'border-none bg-transparent text-[16px] opacity-50 transition-opacity hover:opacity-100 dark:bg-transparent'
              }
              size="icon"
              variant="secondary"
              type="button"
              onClick={() => remove(index)}
            >
              <ClearOutlined fontSize="inherit" />
            </Button>
          </div>
        ))}
        <Button
          size="sm"
          variant="secondary"
          className="self-start"
          type="button"
          onClick={() => {
            append({ value: '', label: '' })
          }}
        >
          Add option
        </Button>
      </div>
    </FormItem>
  )
}

interface CustomFieldFormBaseProps {
  update: boolean
}

const CustomFieldForm: React.FC<CustomFieldFormBaseProps> = ({ update }) => {
  const { control, watch } = useFormContext<
    schemas['CustomFieldCreate'] | schemas['CustomFieldUpdate']
  >()
  const type = watch('type')

  return (
    <>
      {!update && (
        <FormField
          control={control}
          name="type"
          rules={{ required: 'Este campo é obrigatório' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(enums.customFieldTypeValues).map((type) => (
                    <SelectItem key={type} value={type} textValue={type}>
                      <CustomFieldTypeLabel type={type} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={control}
        name="slug"
        rules={{
          minLength: {
            value: 1,
            message: 'Este campo não pode estar vazio',
          },
          required: 'Este campo é obrigatório',
        }}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Será usado como chave ao armazenar o valor. Deve ser único em
                toda a sua organização. Pode conter apenas letras ASCII, números
                e hífens.
              </FormDescription>
            </FormItem>
          )
        }}
      />

      <FormField
        control={control}
        name="name"
        rules={{
          minLength: {
            value: 1,
            message: 'Este campo não pode estar vazio',
          },
          required: 'Este campo é obrigatório',
        }}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      {type === 'select' && <CustomFieldSelectProperties />}
      <Accordion type="single" collapsible className="flex flex-col gap-y-6">
        <AccordionItem
          value="form-input-options"
          className="dark:border-polar-700 rounded-xl border border-gray-200 px-4"
        >
          <AccordionTrigger className="hover:no-underline">
            Opções de entrada do formulário
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-y-6">
            {type === 'text' && (
              <FormField
                control={control}
                name="properties.textarea"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Área de texto</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            )}
            <FormField
              control={control}
              name="properties.form_label"
              rules={{
                minLength: {
                  value: 1,
                  message: 'Este campo não pode estar vazio',
                },
              }}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Rótulo</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Usa o nome do campo se não fornecido. Markdown suportado.
                    </FormDescription>
                  </FormItem>
                )
              }}
            />
            <FormField
              control={control}
              name="properties.form_help_text"
              rules={{
                minLength: {
                  value: 1,
                  message: 'Este campo não pode estar vazio',
                },
              }}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Texto de ajuda</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Usado no formulário de checkout. Markdown suportado.
                    </FormDescription>
                  </FormItem>
                )
              }}
            />
            <FormField
              control={control}
              name="properties.form_placeholder"
              rules={{
                minLength: {
                  value: 1,
                  message: 'Este campo não pode estar vazio',
                },
              }}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Placeholder</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Usado no formulário de checkout.
                    </FormDescription>
                  </FormItem>
                )
              }}
            />
          </AccordionContent>
        </AccordionItem>
        {(type === 'text' || type === 'number' || type === 'date') && (
          <AccordionItem
            value="validation-constraints"
            className="dark:border-polar-700 rounded-xl border border-gray-200 px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              Restrições de validação
            </AccordionTrigger>

            <AccordionContent className="flex flex-col gap-y-6">
              {type === 'text' && <CustomFieldTextProperties />}
              {type === 'number' && <CustomFieldComparableProperties />}
              {type === 'date' && <CustomFieldComparableProperties />}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </>
  )
}

export default CustomFieldForm
