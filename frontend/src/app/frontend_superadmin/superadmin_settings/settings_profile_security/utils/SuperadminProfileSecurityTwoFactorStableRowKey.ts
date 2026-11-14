// FLOW: Feature display boundary -> superadmin_settings/settings_profile_security/utils/SuperadminProfileSecurityTwoFactorStableRowKey.ts -> local masking/sanitization rule -> safe presentation.
/** Responsibility: Superadmin Profile Stable Row Key; provides focused module-owned formatting or pure utility behavior. */
function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(Object.keys(record).sort().map((key) => [key, canonicalize(record[key])]));
  }
  return value;
}

/**
 * Performs the stable row key operation within profile security; inputs and outputs follow the declared TypeScript contract.
 * @param row Input required by the declared feature contract. Declared type: T.
 * @returns The declared result for this operation. Declared type: string.
 */
export function stableRowKey<T extends object>(row: T): string {
  const record = row as unknown as Record<string, unknown>;
  for (const field of ['id', 'key', 'uuid', 'smartId', 'receiptId', 'paymentId', 'enquiryId', 'studentId']) {
    const value = record[field];
    if (typeof value === 'string' || typeof value === 'number') return `${field}:${value}`;
  }
  return JSON.stringify(canonicalize(row)) ?? String(row);
}
