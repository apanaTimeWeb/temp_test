// RESPONSIBILITY: Define the typed API/query boundary for dashboard overview; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_dashboard/dashboard_overview/api/superadmin_dashboard_overview.api.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/**
 * API contract boundary for dashboard_overview.
 *
 * No verified backend endpoint, request schema, response schema, permission contract, or write semantics
 * were supplied for this feature. This module intentionally performs no network request and invents no URL.
 * Replace this status-only contract with typed request functions only after an approved backend contract is supplied.
 */
export const SUPERADMINDASHBOARDOVERVIEW_API_CONTRACT_STATUS = {
  status: 'unavailable',
  requiredInputs: ['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract'],
  source: 'SUPPLIED_FRONTEND_ARCHIVE',
  networkCallsEnabled: false,
  reason: 'No verified API contract was supplied for this feature module.',
} as const;
