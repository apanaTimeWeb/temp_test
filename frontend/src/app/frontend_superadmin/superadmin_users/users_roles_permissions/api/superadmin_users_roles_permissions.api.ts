// RESPONSIBILITY: Define the typed API/query boundary for users roles permissions; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_users/users_roles_permissions/api/superadmin_users_roles_permissions.api.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/**
 * API boundary for users_roles_permissions.
 * The supplied frontend archive does not include an approved endpoint/request/response contract.
 * Do not add network calls or infer permissions, payload fields, persistence, or write semantics
 * until the host/backend contract is supplied and reviewed.
 */
export const SUPERADMIN_USERS_ROLES_PERMISSIONS_API_CONTRACT_STATUS = {
  status: 'CONTRACT_MISSING',
  source: 'SUPPLIED_FRONTEND_ARCHIVE',
  networkCallsEnabled: false,
  requiredInputs: ['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract'],
} as const;
