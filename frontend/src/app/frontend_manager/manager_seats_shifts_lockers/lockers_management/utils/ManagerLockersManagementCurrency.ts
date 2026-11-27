export function formatManagerLockerInr(amount: number, includeDecimals = false): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(safe);
}

export function getManagerLockerCurrencySymbol(): string {
  const part = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
    .formatToParts(0)
    .find((p) => p.type === 'currency');
  return part?.value ?? 'INR';
}
