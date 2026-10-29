/**
 * Masks member phone values in list/profile views. The source value remains
 * unchanged; only the presentation string is returned. Only the final four
 * digits are revealed when a value contains more than four digits.
 */
export function maskManagerMemberPhone(value: string | null | undefined): string {
  const normalized = value?.trim() ?? '';
  if (!normalized) return '—';

  const digits = normalized.replace(/\D/g, '');
  if (!digits) return normalized;
  if (digits.length <= 4) return '•'.repeat(4);

  return `${'•'.repeat(digits.length - 4)}${digits.slice(-4)}`;
}
