
export const formatCurrency = (
  value: number,
  options?: { fractionDigits?: number }
) => {
  const fractionDigits = options?.fractionDigits ?? 0;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
};
