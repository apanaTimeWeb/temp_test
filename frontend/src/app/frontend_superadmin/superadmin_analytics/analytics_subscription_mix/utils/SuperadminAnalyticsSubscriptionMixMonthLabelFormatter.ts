// RESPONSIBILITY: Format typed values for analytics subscription mix display using the supplied locale/currency contract; it does not mutate underlying values.
// FLOW: Feature UI -> superadmin_analytics/analytics_subscription_mix/utils/SuperadminAnalyticsSubscriptionMixMonthLabelFormatter.ts -> typed values and locale -> formatted display output.
import { format as formatDateFns, parseISO } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';

/** Formats a stable month label from a date-only fixture using the active locale. */
const SUPERADMINANALYTICSSUBSCRIPTIONMIX_MONTH_INDEX: Readonly<Record<string, number>> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

/** Returns a localized short month label for a canonical English month key. Unknown keys pass through unchanged. 
 * @param month - Input supplied by the caller under the declared TypeScript contract.
 * @param locale - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example formatSuperadminAnalyticsSubscriptionMixMonthLabel(month, locale) uses the declared inputs to produce the module's canonical output.
 */
export function formatSuperadminAnalyticsSubscriptionMixMonthLabel(month: string, locale: string): string {
  const monthIndex = SUPERADMINANALYTICSSUBSCRIPTIONMIX_MONTH_INDEX[month];
  if (monthIndex === undefined) return month;
  const localMonthStart = parseISO(`2025-${String(monthIndex + 1).padStart(2, '0')}-01`);
  return formatDateFns(localMonthStart, 'MMM', { locale: resolveSuperadminDateFnsLocale(locale) });
}

function resolveSuperadminDateFnsLocale(locale: string) {
  return locale.toLowerCase().startsWith('hi') ? hi : enUS;
}
