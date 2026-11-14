// RESPONSIBILITY: Provide deterministic module-owned helper behavior for billing member refunds; it does not own page routing or live backend persistence.
// FLOW: Feature caller -> superadmin_billing/billing_member_refunds/utils/SuperadminBillingOverviewMemberRefundsRefundTotalsUtilities.ts -> typed input/contract -> deterministic helper result.
/** Group processed refund totals by currency; unlike-currency amounts must never be summed together. 
 * @param refunds - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example groupSuperadminMemberRefundTotalsByCurrency(refunds) uses the declared inputs to produce the module's canonical output.
 */
export function groupSuperadminMemberRefundTotalsByCurrency<T extends { status: string; currencyCode: string; netRefundMinor: number }>(
  refunds: readonly T[],
): Array<{ currencyCode: string; amountMinor: number }> {
  const totals = new Map<string, number>();
  for (const refund of refunds) {
    if (refund.status !== 'processed') continue;
    if (!Number.isSafeInteger(refund.netRefundMinor) || refund.netRefundMinor < 0 || !/^[A-Z]{3}$/.test(refund.currencyCode)) continue;
    const nextTotal = (totals.get(refund.currencyCode) ?? 0) + refund.netRefundMinor;
    if (!Number.isSafeInteger(nextTotal)) {
      throw new RangeError(`Processed refund total exceeds the safe integer range for ${refund.currencyCode}.`);
    }
    totals.set(refund.currencyCode, nextTotal);
  }
  return [...totals.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([currencyCode, amountMinor]) => ({ currencyCode, amountMinor }));
}
