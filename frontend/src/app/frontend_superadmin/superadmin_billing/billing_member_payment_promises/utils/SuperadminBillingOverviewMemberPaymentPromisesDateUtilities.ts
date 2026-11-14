// RESPONSIBILITY: Format typed values for billing member payment promises display using the supplied locale/currency contract; it does not mutate underlying values.
// FLOW: Feature UI -> superadmin_billing/billing_member_payment_promises/utils/SuperadminBillingOverviewMemberPaymentPromisesDateUtilities.ts -> typed values and locale -> formatted display output.
/** Create a UTC calendar date without Date.UTC's special remapping of years 0000–0099. */
function createSuperadminFinanceUtcDate(year: number, monthIndex: number, day: number): Date {
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, monthIndex, day);
  return date;
}

/** Calculate date-only calendar-day distance without UTC/local-midnight drift. 
 * @param isoDate - Input supplied by the caller under the declared TypeScript contract.
 * @param now - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function SuperadminFinanceCalculateDaysUntilDate(isoDate: string, now: Date = new Date()): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) throw new RangeError('Expected a calendar date in YYYY-MM-DD format.');

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const target = createSuperadminFinanceUtcDate(year, month - 1, day);
  if (target.getUTCFullYear() !== year || target.getUTCMonth() !== month - 1 || target.getUTCDate() !== day) {
    throw new RangeError('Expected a valid calendar date.');
  }

  const today = createSuperadminFinanceUtcDate(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
