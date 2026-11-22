// RESPONSIBILITY: Locale-aware staff display labels and privacy-preserving collection contact formatting.
type AdminStaffDirectoryLastActiveMessageKey =
  | 'LAST_ACTIVE_TWO_MINUTES'
  | 'LAST_ACTIVE_ONE_HOUR'
  | 'LAST_ACTIVE_THREE_DAYS'
  | 'LAST_ACTIVE_ONE_MONTH'
  | 'LAST_ACTIVE_NEVER'
  | 'LAST_ACTIVE_TODAY'
  | 'LAST_ACTIVE_YESTERDAY'
  | 'LAST_ACTIVE_UNKNOWN';

const LABEL_KEYS: Readonly<Record<string, AdminStaffDirectoryLastActiveMessageKey>> = {
  '2 mins ago': 'LAST_ACTIVE_TWO_MINUTES',
  '1 hr ago': 'LAST_ACTIVE_ONE_HOUR',
  '3 days ago': 'LAST_ACTIVE_THREE_DAYS',
  '1 month ago': 'LAST_ACTIVE_ONE_MONTH',
  Never: 'LAST_ACTIVE_NEVER',
  Today: 'LAST_ACTIVE_TODAY',
  Yesterday: 'LAST_ACTIVE_YESTERDAY',
  'Never (synthetic fixture)': 'LAST_ACTIVE_NEVER',
};

export function getAdminStaffDirectoryLastActiveLabel(
  value: string,
  translate: (key: AdminStaffDirectoryLastActiveMessageKey) => string,
): string {
  return translate(LABEL_KEYS[value] ?? 'LAST_ACTIVE_UNKNOWN');
}

/** Mask sensitive contact details in collection views; reveal full values only in an authorized detail flow. */
export function maskAdminStaffDirectoryEmail(value: string | null | undefined): string {
  const email = value?.trim() ?? '';
  const at = email.lastIndexOf('@');
  if (!email || at <= 0 || at === email.length - 1) return '—';
  const local = email.slice(0, at);
  const visible = local.length === 1 ? '*' : local.length === 2 ? `${local[0]}*` : `${local[0]}${'*'.repeat(Math.min(5, local.length - 2))}${local.at(-1)}`;
  return `${visible}@${email.slice(at + 1)}`;
}

export function maskAdminStaffDirectoryPhone(value: string | null | undefined): string {
  const digits = (value ?? '').replace(/\D/g, '');
  if (!digits) return '—';
  const local = digits.length > 10 ? digits.slice(-10) : digits;
  if (local.length <= 6) return '*'.repeat(local.length);
  return `${local.slice(0, 2)}${'*'.repeat(local.length - 6)}${local.slice(-4)}`;
}

