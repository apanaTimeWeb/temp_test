
/** Masks a phone number for communication history surfaces. */
export function maskManagerComplaintsPhone(phone: string | null | undefined): string {
  const raw = (phone ?? '').trim();
  if (!raw) return '—';
  const existingMask = /^(?:\+?\d{1,3}[\s-]*)?(\d{2,4})[\s*•xX]+(\d{2,4})$/i.exec(raw);
  if (existingMask) return `${existingMask[1]}••••${existingMask[2]}`;
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '—';
  const local = digits.slice(-10);
  if (local.length < 4) return '••••';
  return `${local.slice(0, 2)}••••${local.slice(-2)}`;
}
