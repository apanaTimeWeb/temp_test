// FLOW: Feature caller -> superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicesStableRowKey.ts -> typed input/contract -> deterministic helper result.
/** Responsibility: stable, property-order-independent row identity for generic preview tables. */
function canonicalize(value: unknown, seen: WeakSet<object>): unknown {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'bigint') return `${value.toString()}n`;
    if (typeof value === 'function' || typeof value === 'symbol' || value === undefined) return String(value);
    return value;
  }
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString();
  if (seen.has(value)) return '[Circular]';
  seen.add(value);
  if (Array.isArray(value)) return value.map((entry) => canonicalize(entry, seen));
  const record = value as Record<string, unknown>;
  return Object.fromEntries(Object.keys(record).sort().map((key) => [key, canonicalize(record[key], seen)]));
}
/**
 * Performs the stable row key operation within billing invoices; inputs and outputs follow the declared TypeScript contract.
 * @param row Input required by the declared feature contract. Declared type: T.
 * @returns The declared result for this operation. Declared type: string.
 */
export function stableRowKey<T extends object>(row: T): string {
  const record = row as unknown as Record<string, unknown>;
  for (const field of ['id', 'key', 'uuid', 'smartId', 'receiptId', 'paymentId', 'enquiryId', 'studentId']) {
    const value = record[field];
    if (typeof value === 'string' || typeof value === 'number') return `${field}:${value}`;
  }
  try { return JSON.stringify(canonicalize(row, new WeakSet<object>())) ?? Object.prototype.toString.call(row); } catch { return Object.prototype.toString.call(row); }
}
