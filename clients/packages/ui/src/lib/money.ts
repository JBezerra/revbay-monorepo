export const getCentsInDollarString = (
  cents: number,
  showCents = false,
  pretty = false,
): string => {
  const dollars = cents / 100

  const precision = cents % 100 === 0 && !showCents ? 0 : 2

  if (pretty) {
    return dollars.toLocaleString('pt-BR', {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
    })
  }

  return dollars.toFixed(precision)
}

export const formatCurrencyAndAmount = (
  cents: number,
  currency: string = 'brl',
  minimumFractionDigits?: number,
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact',
): string => {
  const currencyNumberFormat = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    notation,
  })
  return currencyNumberFormat.format(cents / 100)
}
