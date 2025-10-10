import { Section } from '@/components/Layout/Section'
import { ProductMetadataForm } from '../ProductMetadataForm'

export interface ProductMetadataSectionProps {
  className?: string
  compact?: boolean
}

export const ProductMetadataSection = ({
  className,
  compact,
}: ProductMetadataSectionProps) => {
  return (
    <Section
      title="Metadados"
      description="Metadados opcionais para associar ao produto"
      className={className}
      compact={compact}
    >
      <ProductMetadataForm />
    </Section>
  )
}
