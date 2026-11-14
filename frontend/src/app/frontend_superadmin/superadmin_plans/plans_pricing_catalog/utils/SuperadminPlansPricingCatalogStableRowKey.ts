// FLOW: Feature caller -> superadmin_plans/plans_pricing_catalog/utils/SuperadminPlansPricingCatalogStableRowKey.ts -> typed input/contract -> deterministic helper result.
/** Responsibility: Superadmin Subscriptions Stable Row Key; provides focused module-owned formatting or pure utility behavior. 
 * @param row - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function stableRowKey<T extends object>(row: T): string {
  const record = row as unknown as Record<string, unknown>;
  for (const field of ['id', 'key', 'uuid', 'smartId', 'receiptId', 'paymentId', 'enquiryId', 'studentId']) {
    const value = record[field];
    if (typeof value === 'string' || typeof value === 'number') return `${field}:${value}`;
  }
  const canonicalize = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.keys(value as Record<string, unknown>).sort().map((key) => [key, canonicalize((value as Record<string, unknown>)[key])]));
    }
    return value;
  };
  return JSON.stringify(canonicalize(row)) ?? String(row);
}
