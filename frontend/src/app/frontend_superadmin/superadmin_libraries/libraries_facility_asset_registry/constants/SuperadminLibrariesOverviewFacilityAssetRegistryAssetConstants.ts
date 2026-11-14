// FLOW: Feature consumers -> superadmin_libraries/libraries_facility_asset_registry/constants/SuperadminLibrariesOverviewFacilityAssetRegistryAssetConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Accounting Asset Constants; centralizes stable module-owned options and configuration. */
import type { SuperadminAccountingAssetStatus } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/types/SuperadminLibrariesOverviewFacilityAssetRegistryAssetTypes';
export const SUPERADMIN_ACCOUNTING_ASSET_STATUS_BADGE: Record<SuperadminAccountingAssetStatus, string> = { active: 'acct-badge--success', maintenance: 'acct-badge--warning', disposed: 'acct-badge--neutral' };
