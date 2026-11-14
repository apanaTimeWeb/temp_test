// FLOW: Canonical dashboard Main -> availability hook -> supplied module API contract status.
/**
 * Reports whether a verified dashboard read contract is available. This hook deliberately performs no request
 * and keeps the route fail-closed while endpoint, schemas, and authorization remain absent.
 */
import { SUPERADMINDASHBOARDOVERVIEW_API_CONTRACT_STATUS } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/api/superadmin_dashboard_overview.api';

export function useSuperadminDashboardOverviewAvailability() {
  const contract = SUPERADMINDASHBOARDOVERVIEW_API_CONTRACT_STATUS;
  return {
    available: contract.status !== 'unavailable' && contract.networkCallsEnabled,
    reason: contract.reason,
  } as const;
}
