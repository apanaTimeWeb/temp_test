/**
 * Document storage operations intentionally remain unavailable in this role archive.
 * No authoritative upload/download/delete endpoint, payload, response, or permission
 * contract was supplied. Local metadata fixtures must never be represented as stored
 * documents; add operations only after the host contract is verified.
 */
export const MANAGER_MEMBERS_DOCUMENT_VAULT_API_CONTRACT_STATUS = 'EXTERNAL_PRODUCT_DECISION_BLOCKED' as const;
