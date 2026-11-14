// RESPONSIBILITY: Define local sample fixtures for libraries facility asset maintenance; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_libraries/libraries_facility_asset_maintenance/mocks/fixtures/SuperadminLibrariesOverviewFacilityAssetMaintenanceMaintenanceMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminAccountingMaintenanceLog } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/types/SuperadminLibrariesOverviewFacilityAssetMaintenanceMaintenanceTypes';

/** Illustrative maintenance items; not live vendor/service records. */
export const SUPERADMIN_ACCOUNTING_SAMPLE_MAINTENANCE_LOGS: readonly SuperadminAccountingMaintenanceLog[] = [
  { id: 1, assetName: 'AC Unit — Hall A', issue: 'Sample gas refill and filter cleaning', reportedDate: '2026-04-02', scheduledDate: '2026-04-08', vendor: 'Sample Vendor A', cost: 1800, status: 'completed' },
  { id: 2, assetName: 'Water Purifier', issue: 'Sample filter replacement', reportedDate: '2026-04-05', scheduledDate: '2026-04-10', vendor: 'Sample Vendor B', cost: 900, status: 'in-progress' },
  { id: 3, assetName: 'CCTV Camera — B2', issue: 'Sample camera diagnostic', reportedDate: '2026-04-08', scheduledDate: '2026-04-12', vendor: 'Sample Vendor C', cost: 1200, status: 'pending' },
  { id: 4, assetName: 'Biometric Scanner', issue: 'Sample fingerprint sensor diagnostic', reportedDate: '2026-04-09', scheduledDate: '2026-04-14', vendor: 'Sample Vendor D', cost: 2500, status: 'pending' },
  { id: 5, assetName: 'Inverter Battery', issue: 'Sample battery backup diagnostic', reportedDate: '2026-03-28', scheduledDate: '2026-04-03', vendor: 'Sample Vendor E', cost: 3500, status: 'completed' },
];
