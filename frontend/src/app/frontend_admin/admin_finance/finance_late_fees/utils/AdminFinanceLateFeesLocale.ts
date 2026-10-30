export const ADMIN_FINANCE_DEFAULT_LOCALE = 'en-IN';

export function getAdminFinanceLocale(): string {
  if (typeof document !== 'undefined' && document.documentElement.lang) return document.documentElement.lang;
  if (typeof navigator !== 'undefined' && navigator.language) return navigator.language;
  return ADMIN_FINANCE_DEFAULT_LOCALE;
}
