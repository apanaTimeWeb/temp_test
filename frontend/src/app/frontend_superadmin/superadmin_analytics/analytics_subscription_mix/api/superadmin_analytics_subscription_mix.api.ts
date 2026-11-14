// RESPONSIBILITY: Define the typed API/query boundary for analytics subscription mix; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_analytics/analytics_subscription_mix/api/superadmin_analytics_subscription_mix.api.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/**
 * API boundary for analytics_subscription_mix.
 * The supplied frontend archive does not include an approved endpoint/request/response contract.
 * Do not add network calls or infer permissions, payload fields, persistence, or write semantics
 * until the host/backend contract is supplied and reviewed.
 */
export const SUPERADMIN_ANALYTICS_SUBSCRIPTION_MIX_API_CONTRACT_STATUS = {
  status: 'CONTRACT_MISSING',
  source: 'SUPPLIED_FRONTEND_ARCHIVE',
  networkCallsEnabled: false,
  requiredInputs: ['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract'],
} as const;
