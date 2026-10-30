/**
 * Masks personal contact values before they appear in UI previews or logs.
 * The function accepts only text and has no persistence, network, or business-domain behavior.
 */
export function maskSensitiveEmail(value: string | null | undefined): string {
  const email = value?.trim() ?? '';
  const at = email.lastIndexOf('@');
  if (!email || at <= 0 || at === email.length - 1) return '—';
  const local = email.slice(0, at);
  const visible = local.length === 1 ? '*' : local.length === 2 ? `${local[0]}*` : `${local[0]}${'*'.repeat(Math.min(5, local.length - 2))}${local.at(-1)}`;
  return `${visible}@${email.slice(at + 1)}`;
}

export function maskSensitivePhone(value: string | null | undefined): string {
  const digits = (value ?? '').replace(/\D/g, '');
  if (!digits) return '—';
  const local = digits.length > 10 ? digits.slice(-10) : digits;
  if (local.length <= 4) return '*'.repeat(local.length);
  if (local.length <= 6) return `${local.slice(0, 1)}${'*'.repeat(local.length - 1)}`;
  return `${local.slice(0, 2)}${'*'.repeat(local.length - 6)}${local.slice(-4)}`;
}
