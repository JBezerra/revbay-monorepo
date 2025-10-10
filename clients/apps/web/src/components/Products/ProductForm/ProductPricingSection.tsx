'use client'

import CreateMeterModalContent from '@/components/Meter/CreateMeterModalContent'
import { InlineModal } from '@/components/Modal/InlineModal'
import { useModal } from '@/components/Modal/useModal'
import { SpinnerNoMargin } from '@/components/Shared/Spinner'
import { useMeters } from '@/hooks/queries/meters'
import {
  isLegacyRecurringPrice,
  isMeteredPrice,
  isStaticPrice,
} from '@/utils/product'
import { PlusIcon } from '@heroicons/react/20/solid'
import { ErrorMessage } from '@hookform/error-message'
import { CloseOutlined } from '@mui/icons-material'
import { schemas } from '@polar-sh/client'
import Alert from '@polar-sh/ui/components/atoms/Alert'
import Button from '@polar-sh/ui/components/atoms/Button'
import MoneyInput from '@polar-sh/ui/components/atoms/MoneyInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@polar-sh/ui/components/atoms/Select'
import ShadowBox from '@polar-sh/ui/components/atoms/ShadowBox'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@polar-sh/ui/components/ui/form'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useFieldArray,
  UseFieldArrayRemove,
  useFormContext,
} from 'react-hook-form'
import { Section } from '../../Layout/Section'
import { ProductFormType } from './ProductForm'
import UnitAmountInput from './UnitAmountInput'

export interface ProductPriceFixedItemProps {
  index: number
}

export const ProductPriceFixedItem: React.FC<ProductPriceFixedItemProps> = ({
  index,
}) => {
  const { control, setValue } = useFormContext<ProductFormType>()

  return (
    <>
      <FormField
        control={control}
        name={`prices.${index}.price_amount`}
        rules={{
          required: 'This field is required',
          min: { value: 50, message: 'Price must be greater than 0.5' },
        }}
        render={({ field }) => {
          return (
            <FormItem className="grow">
              <div className="flex items-center gap-2">
                <FormControl>
                  <MoneyInput
                    name={field.name}
                    value={field.value}
                    onChange={(v) => {
                      field.onChange(v)
                      setValue(`prices.${index}.id`, '')
                    }}
                    placeholder={0}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </>
  )
}

export interface ProductPriceCustomItemProps {
  index: number
}

export const ProductPriceCustomItem: React.FC<ProductPriceCustomItemProps> = ({
  index,
}) => {
  const { control, setValue } = useFormContext<ProductFormType>()

  return (
    <div className="flex w-40 flex-col gap-4">
      <FormField
        control={control}
        name={`prices.${index}.minimum_amount`}
        rules={{
          min: { value: 50, message: 'Price must be greater than $0.5' },
        }}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Minimum amount</FormLabel>
              <FormControl>
                <MoneyInput
                  name={field.name}
                  value={field.value || undefined}
                  onChange={(v) => {
                    field.onChange(v)
                    setValue(`prices.${index}.id`, '')
                  }}
                  placeholder={1000}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <FormField
        control={control}
        name={`prices.${index}.preset_amount`}
        rules={{
          min: { value: 50, message: 'Price must be greater than $0.5' },
          max: {
            value: 1_000_000,
            message: 'Price cannot be greater than $10,000',
          },
        }}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Suggested amount</FormLabel>
              <FormControl>
                <MoneyInput
                  name={field.name}
                  value={field.value || undefined}
                  onChange={(v) => {
                    field.onChange(v)
                    setValue(`prices.${index}.id`, '')
                  }}
                  placeholder={5000}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </div>
  )
}

export interface ProductPriceFreeItemProps {
  index: number
}

export const ProductPriceFreeItem: React.FC<ProductPriceFreeItemProps> = () => {
  return <></>
}

export interface ProductPriceMeteredUnitItemProps {
  organization: schemas['Organization']
  index: number
}

export const ProductPriceMeteredUnitItem: React.FC<
  ProductPriceMeteredUnitItemProps
> = ({ organization, index }) => {
  const { control, setValue } = useFormContext<ProductFormType>()

  const { data: meters, refetch } = useMeters(organization.id, {
    sorting: ['name'],
  })

  const {
    isShown: isCreateMeterModalShown,
    show: showCreateMeterModal,
    hide: hideCreateMeterModal,
  } = useModal(false)

  const onSelectMeter = useCallback(
    async (meter: schemas['Meter']) => {
      // This is embarrassing but the <Select /> component has to re-render
      // with the updated `meters` as options,
      // before it'll accept this as a valid select value.
      //
      // This is an open issue with Radix UI since 2024
      // (https://github.com/radix-ui/primitives/issues/2817)

      // To work around this, we run an explicit `refetch` that we can await
      // and then set the value in a double requestAnimationFrame callback.
      // First rAF ensures this component is updated,
      // second rAF ensures the <SelectContent /> was updated too.
      await refetch()

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setValue(`prices.${index}.meter_id`, meter.id)
        })
      })
    },
    [setValue, index],
  )

  if (!meters) {
    return (
      <div className="flex w-full items-center justify-center py-4">
        <SpinnerNoMargin />
      </div>
    )
  }

  return (
    <>
      {meters.items.length === 0 ? (
        <Alert color="gray">
          <p className="text-center text-sm">
            <button
              onClick={(e) => {
                e.preventDefault()
                showCreateMeterModal()
              }}
              type="button"
              className="font-medium underline"
            >
              Configure sua primeira métrica
            </button>{' '}
            para começar a usar preço por uso
          </p>
        </Alert>
      ) : (
        <>
          <FormField
            control={control}
            name={`prices.${index}.meter_id`}
            rules={{
              required: 'Este campo é obrigatório',
            }}
            render={({ field }) => {
              return (
                <FormItem>
                  <div className="flex flex-row items-center justify-between gap-x-2">
                    <FormLabel>Métrica</FormLabel>
                    <button
                      type="button"
                      className="flex flex-row items-center gap-x-1 text-sm font-medium text-gray-500"
                      onClick={(e) => {
                        e.preventDefault()
                        showCreateMeterModal()
                      }}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Adicionar Métrica
                    </button>
                  </div>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(v) => {
                        field.onChange(v)
                        setValue(`prices.${index}.id`, '')
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma métrica" />
                      </SelectTrigger>
                      <SelectContent>
                        {meters.items.map((meter) => (
                          <SelectItem key={meter.id} value={meter.id}>
                            {meter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={control}
            name={`prices.${index}.unit_amount`}
            rules={{
              min: 0,
              required: 'Este campo é obrigatório',
            }}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Preço por unidade</FormLabel>
                  <FormControl>
                    <UnitAmountInput
                      {...field}
                      name={field.name}
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v)
                        setValue(`prices.${index}.id`, '')
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={control}
            name={`prices.${index}.cap_amount`}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Valor máximo</FormLabel>
                  <FormControl>
                    <MoneyInput
                      {...field}
                      name={field.name}
                      value={field.value || undefined}
                      onChange={(v) => {
                        field.onChange(v)
                        setValue(`prices.${index}.id`, '')
                      }}
                      placeholder={10000}
                    />
                  </FormControl>
                  <FormDescription>
                    Valor máximo que pode ser cobrado, independentemente do uso.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </>
      )}
      <InlineModal
        isShown={isCreateMeterModalShown}
        hide={hideCreateMeterModal}
        modalContent={
          <CreateMeterModalContent
            organization={organization}
            onSelectMeter={onSelectMeter}
            hideModal={hideCreateMeterModal}
          />
        }
      />
    </>
  )
}

const ProductPriceItemWrapper = ({
  prices,
  children,
}: {
  prices: schemas['ProductPrice'][]
  children: React.ReactNode
}) => {
  if (!prices || prices.length < 2) {
    return children
  }
  return (
    <div className="dark:border-polar-700 rounded-2xl border p-4">
      {children}
    </div>
  )
}

interface ProductPriceItemProps {
  organization: schemas['Organization']
  index: number
  remove: UseFieldArrayRemove
}

const ProductPriceItem: React.FC<ProductPriceItemProps> = ({
  organization,
  index,
  remove,
}) => {
  const { register, control, setValue, watch } =
    useFormContext<ProductFormType>()
  const amountType = watch(`prices.${index}.amount_type`)
  const recurringInterval = watch('recurring_interval')

  const prices = watch('prices')
  const staticPriceIndex = prices
    ? (prices as schemas['ProductPrice'][]).findIndex(isStaticPrice)
    : -1

  const onAmountTypeChange = useCallback(
    (amountType: schemas['ProductCreate']['prices'][number]['amount_type']) => {
      const replace = (v: schemas['ProductCreate']['prices'][number]) => {
        setValue(`prices.${index}`, v)
      }
      if (amountType === 'fixed') {
        replace({
          amount_type: 'fixed',
          price_currency: 'brl',
          price_amount: 0,
        })
      } else if (amountType === 'custom') {
        replace({
          amount_type: 'custom',
          price_currency: 'brl',
        })
      } else if (amountType === 'free') {
        replace({
          amount_type: 'free',
        })
      } else if (amountType === 'metered_unit') {
        replace({
          amount_type: 'metered_unit',
          price_currency: 'brl',
          unit_amount: 0,
          meter_id: '',
        })
      }
    },
    [index, setValue],
  )

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" {...register(`prices.${index}.id`)} />
      <FormField
        control={control}
        name={`prices.${index}.amount_type`}
        render={({ field }) => {
          return (
            <FormItem>
              <div className="flex flex-row items-center gap-2">
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v)
                      onAmountTypeChange(v as any)
                      setValue(`prices.${index}.id`, '')
                    }}
                    disabled={
                      staticPriceIndex > -1 && staticPriceIndex !== index
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo de preço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Preço fixo</SelectItem>
                      {recurringInterval !== null && (
                        <SelectItem value="metered_unit">
                          Preço por uso
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                {index > 0 && (
                  <Button
                    size="icon"
                    className="aspect-square h-10 w-10"
                    variant="secondary"
                    onClick={() => {
                      remove(index)
                    }}
                  >
                    <CloseOutlined className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      {amountType === 'fixed' && <ProductPriceFixedItem index={index} />}
      {amountType === 'custom' && <ProductPriceCustomItem index={index} />}
      {amountType === 'free' && <ProductPriceFreeItem index={index} />}
      {amountType === 'metered_unit' && (
        <ProductPriceMeteredUnitItem
          organization={organization}
          index={index}
        />
      )}
    </div>
  )
}

export interface ProductPricingSectionProps {
  organization: schemas['Organization']
  className?: string
  update?: boolean
  compact?: boolean
}

export const ProductPricingSection = ({
  organization,
  className,
  update,
  compact,
}: ProductPricingSectionProps) => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ProductFormType>()

  const pricesFieldArray = useFieldArray({
    control,
    name: 'prices',
  })
  const { fields: prices, replace, append, remove } = pricesFieldArray

  const recurringInterval = watch('recurring_interval')

  const isLegacyRecurringProduct = useMemo(
    () => (prices as schemas['ProductPrice'][]).some(isLegacyRecurringPrice),
    [prices],
  )
  const [legacyMigration, setLegacyMigration] = useState(false)

  const switchToNewPricingModel = useCallback(() => {
    setLegacyMigration(true)
    const price = prices[0] as schemas['LegacyRecurringProductPrice']
    setValue('recurring_interval', 'month')
    replace([
      {
        ...price,
        // @ts-ignore
        id: null,
        type: null,
        recurring_interval: null,
      },
    ])
  }, [prices, replace, setValue])

  useEffect(() => {
    if (recurringInterval !== null) {
      return
    }
    prices.forEach((price, index) => {
      if (isMeteredPrice(price as schemas['ProductPrice'])) {
        remove(index)
      }
    })
  }, [recurringInterval, prices, remove])

  return (
    <Section
      title="Preços"
      description="Configure seu ciclo e modelo de cobrança"
      className={className}
      compact={compact}
    >
      {isLegacyRecurringProduct && !legacyMigration ? (
        <div className="prose dark:bg-polar-700 dark:text-polar-500 rounded-2xl bg-gray-100 p-6 text-sm text-gray-500">
          <p>
            Este produto usa um modelo de cobrança obsoleto com ambos um preço
            mensal e anual.
          </p>
          <p>
            Para melhor suportar o modelo de cobrança futuro, o ciclo de
            cobrança é agora configurado no nível do produto, o que significa
            que você precisa criar um produto separado para cada ciclo de
            cobrança.
          </p>
          <Button type="button" size="sm" onClick={switchToNewPricingModel}>
            Mudar para novo modelo de cobrança
          </Button>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-6">
          <FormField
            control={control}
            name="recurring_interval"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === 'one_time' ? null : value)
                      }
                      defaultValue={
                        field.value === null ? 'one_time' : field.value
                      }
                      disabled={update && !legacyMigration}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a billing cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        {!legacyMigration && (
                          <SelectItem value="one_time">Compra única</SelectItem>
                        )}
                        <SelectItem value="month">Mensal</SelectItem>
                        <SelectItem value="year">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          {prices.map((price, index) => (
            <ProductPriceItemWrapper
              prices={prices as schemas['ProductPrice'][]}
              key={price.id}
            >
              <ProductPriceItem
                organization={organization}
                index={index}
                remove={remove}
              />
            </ProductPriceItemWrapper>
          ))}

          {update && recurringInterval && (
            <ShadowBox className="dark:bg-polar-800 flex flex-col gap-2 !rounded-2xl !border-none p-4">
              <h3 className="text-sm font-medium">
                Atualizando modelo de cobrança
              </h3>
              <p className="dark:text-polar-500 text-gray-5 00 text-sm">
                Mudar modelo de cobrança em produtos de assinatura afetará
                apenas novos clientes. Clientes atuais manterão seu modelo de
                cobrança original.
              </p>
            </ShadowBox>
          )}
          {recurringInterval !== null && (
            <Button
              className="self-start"
              onClick={() =>
                append({
                  amount_type: 'metered_unit',
                  price_currency: 'brl',
                  meter_id: '',
                  unit_amount: 0,
                })
              }
            >
              Adicionar Preço
            </Button>
          )}
          <ErrorMessage
            errors={errors}
            name="prices"
            render={({ message }) => (
              <p className="text-destructive text-sm font-medium">{message}</p>
            )}
          />
        </div>
      )}
    </Section>
  )
}
