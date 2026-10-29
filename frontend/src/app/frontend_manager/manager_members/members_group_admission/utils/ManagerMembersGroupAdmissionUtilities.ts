
/** Masks a student phone number for list presentation; never use this for API identity or search. */
export function maskManagerGroupAdmissionPhone(phone: string | null | undefined): string {
  const digits = (phone ?? '').replace(/\D/g, '');
  if (!digits) return '—';
  const local = digits.slice(-10);
  if (local.length < 4) return '••••';
  return `${local.slice(0, 2)}••••${local.slice(-2)}`;
}
