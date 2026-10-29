
/** Masks a phone number for finance preview surfaces; not suitable for identity matching. */
export function maskManagerCollectFeePhone(phone: string | null | undefined): string {
  const digits = (phone ?? '').replace(/\D/g, '').slice(-10);
  if (!digits) return '—';
  if (digits.length < 4) return '••••';
  return `${digits.slice(0, 2)}••••${digits.slice(-2)}`;
}
