// RESPONSIBILITY: Format typed values for libraries overview display using the supplied locale/currency contract; it does not mutate underlying values.
// FLOW: Feature UI -> superadmin_libraries/libraries_overview/utils/SuperadminLibrariesOverviewCapacityScalingDateFormatter.ts -> typed values and locale -> formatted display output.
import { format as formatDateFns, isValid, parseISO } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';

/** Formats a fixed local date-only preview fixture with the active supported locale. 
 * @param dateOnly - Input supplied by the caller under the declared TypeScript contract.
 * @param locale - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example formatSuperadminLibrariesOverviewCapacityScalingDateLabel(dateOnly, locale) uses the declared inputs to produce the module's canonical output.
 */
export function formatSuperadminLibrariesOverviewCapacityScalingDateLabel(dateOnly: string, locale: string): string {
  const parsed = parseISO(dateOnly);
  if (!isValid(parsed)) return '—';
  const dateLocale = locale.toLowerCase().startsWith('hi') ? hi : enUS;
  return formatDateFns(parsed, 'MMM d', { locale: dateLocale });
}
