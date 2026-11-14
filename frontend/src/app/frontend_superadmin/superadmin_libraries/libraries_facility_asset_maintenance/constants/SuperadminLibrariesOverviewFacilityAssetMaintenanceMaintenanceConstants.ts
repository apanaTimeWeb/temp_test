// FLOW: Feature consumers -> superadmin_libraries/libraries_facility_asset_maintenance/constants/SuperadminLibrariesOverviewFacilityAssetMaintenanceMaintenanceConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Accounting Maintenance Constants; centralizes stable module-owned options and configuration. */
import type { SuperadminAccountingMaintenanceStatus } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/types/SuperadminLibrariesOverviewFacilityAssetMaintenanceMaintenanceTypes';
export const SUPERADMIN_ACCOUNTING_MAINTENANCE_STATUS_BADGE: Record<SuperadminAccountingMaintenanceStatus, string> = { pending: 'acct-badge--warning', 'in-progress': 'acct-badge--info', completed: 'acct-badge--success' };
