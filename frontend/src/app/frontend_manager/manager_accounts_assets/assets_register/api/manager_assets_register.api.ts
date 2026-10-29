/**
 * Accounting operations intentionally remain unavailable in this role archive.
 * It does not supply authoritative endpoint, payload, response, or permission
 * contracts. Local draft validation must never be represented as persistence.
 */
export const MANAGER_ACCOUNTING_API_CONTRACT_STATUS = 'EXTERNAL_PRODUCT_DECISION_BLOCKED' as const;
