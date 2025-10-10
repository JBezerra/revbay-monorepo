import { schemas } from '@polar-sh/client'
import React from 'react'

interface ProductPriceTypeLabelProps {
  productPriceType: schemas['ProductPriceType']
}

const ProductPriceTypeLabel: React.FC<ProductPriceTypeLabelProps> = ({
  productPriceType,
}) => {
  switch (productPriceType) {
    case 'one_time':
      return 'Compra única'
    case 'recurring':
      return 'Assinatura'
    default:
      return null
  }
}

export default ProductPriceTypeLabel
