/** Masks phone numbers in dashboard summaries while preserving enough digits for recognition. */
export function maskManagerDashboardPhone(phone: string | null | undefined): string {
  const digits = (phone ?? '').replace(/\D/g, '').slice(-10);
  if (!digits) return '—';
  if (digits.length < 4) return '••••';
  return `${digits.slice(0, 2)}••••${digits.slice(-2)}`;
}
