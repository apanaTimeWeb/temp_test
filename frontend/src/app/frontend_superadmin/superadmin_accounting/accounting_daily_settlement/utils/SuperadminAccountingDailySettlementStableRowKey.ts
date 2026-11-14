// FLOW: Feature caller -> superadmin_accounting/accounting_daily_settlement/utils/SuperadminAccountingDailySettlementStableRowKey.ts -> typed input/contract -> deterministic helper result.
/** Responsibility: Superadmin Accounting Stable Row Key; provides focused module-owned formatting or pure utility behavior. 
 * @param row - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function stableRowKey<T extends object>(row: T): string {
  const record = row as unknown as Record<string, unknown>;
  for (const field of ['id', 'key', 'uuid', 'smartId', 'receiptId', 'paymentId', 'enquiryId', 'studentId']) {
    const value = record[field];
    if (typeof value === 'string' || typeof value === 'number') return `${field}:${value}`;
  }
  return JSON.stringify(row) ?? String(row);
}
