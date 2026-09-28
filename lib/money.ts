export function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatMoney(cents: number) {
  return formatPrice(cents / 100);
}

export function eurosToCents(value: number) {
  return Math.round(value * 100);
}
