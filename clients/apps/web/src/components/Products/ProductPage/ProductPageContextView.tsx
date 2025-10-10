import { useUpdateProduct, useUpdateProductBenefits } from '@/hooks/queries'
import { setValidationErrors } from '@/utils/api/errors'
import { isValidationError, schemas } from '@polar-sh/client'
import Button from '@polar-sh/ui/components/atoms/Button'
import { Form } from '@polar-sh/ui/components/ui/form'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getStatusRedirect } from '../../Toast/utils'
import ProductForm, { ProductFullMediasMixin } from '../ProductForm/ProductForm'

type ProductUpdateForm = Omit<schemas['ProductUpdate'], 'metadata'> &
  ProductFullMediasMixin & {
    metadata: { key: string; value: string | number | boolean }[]
  }

export interface ProductPageContextViewProps {
  organization: schemas['Organization']
  product: schemas['Product']
}

export const ProductPageContextView = ({
  organization,
  product,
}: ProductPageContextViewProps) => {
  const router = useRouter()

  const [enabledBenefitIds] = useState<schemas['Benefit']['id'][]>(
    product.benefits.map((benefit) => benefit.id) ?? [],
  )

  const form = useForm<ProductUpdateForm>({
    defaultValues: {
      ...product,
      medias: product.medias.map((media) => media.id),
      full_medias: product.medias,
      metadata: Object.entries(product.metadata).map(([key, value]) => ({
        key,
        value,
      })),
    },
  })

  const { handleSubmit, setError } = form

  const updateProduct = useUpdateProduct(organization)
  const updateBenefits = useUpdateProductBenefits(organization)

  const onSubmit = useCallback(
    async (productUpdate: ProductUpdateForm) => {
      const { full_medias, ...productUpdateRest } = productUpdate
      const { error } = await updateProduct.mutateAsync({
        id: product.id,
        body: {
          ...productUpdateRest,
          medias: full_medias.map((media) => media.id),
          metadata: productUpdateRest.metadata?.reduce(
            (acc, { key, value }) => ({ ...acc, [key]: value }),
            {},
          ),
        },
      })

      if (error) {
        if (isValidationError(error.detail)) {
          setValidationErrors(error.detail, setError)
        }
        return
      }

      await updateBenefits.mutateAsync({
        id: product.id,
        body: {
          benefits: enabledBenefitIds,
        },
      })

      router.push(
        getStatusRedirect(
          `/dashboard/${organization.slug}/products`,
          'Product Updated',
          `Product ${product.name} updated successfully`,
        ),
      )
    },
    [
      organization,
      product,
      enabledBenefitIds,
      updateProduct,
      updateBenefits,
      setError,
      router,
    ],
  )

  return (
    <div className="flex h-full flex-col justify-between pt-4">
      <div className="dark:divide-polar-700 flex h-full flex-col divide-y overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6"
          >
            <ProductForm
              organization={organization}
              update={true}
              compact={true}
            />
          </form>
        </Form>

        <div className="flex flex-row items-center gap-4 p-8">
          <Button
            onClick={handleSubmit(onSubmit)}
            loading={updateProduct.isPending || updateBenefits.isPending}
            disabled={updateProduct.isPending || updateBenefits.isPending}
          >
            Save Product
          </Button>
        </div>
      </div>
    </div>
  )
}
