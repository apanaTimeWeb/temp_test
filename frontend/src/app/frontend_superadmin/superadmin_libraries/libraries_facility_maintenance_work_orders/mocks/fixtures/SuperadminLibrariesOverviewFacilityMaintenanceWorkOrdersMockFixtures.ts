// RESPONSIBILITY: Define local sample fixtures for libraries facility maintenance work orders; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_libraries/libraries_facility_maintenance_work_orders/mocks/fixtures/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type {
  SuperadminSystemAssetMaintenanceSample,
  SuperadminSystemLockerMaintenanceSample,
  SuperadminSystemSeatMaintenanceSample,
} from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/types/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersTypes';

/** Synthetic maintenance rows for the offline UI preview; these are not live asset records. */
export const SUPERADMIN_SYSTEM_SEAT_MAINTENANCE_SAMPLES: SuperadminSystemSeatMaintenanceSample[] = [
  { id: 'S-01', status: 'Needs Attention', lastMaint: '2026-01-12', daysSince: 89 },
  { id: 'S-07', status: 'OK', lastMaint: '2026-03-20', daysSince: 22 },
  { id: 'S-14', status: 'Needs Attention', lastMaint: '2025-12-31', daysSince: 101 },
  { id: 'S-22', status: 'OK', lastMaint: '2026-04-01', daysSince: 10 },
];

export const SUPERADMIN_SYSTEM_ASSET_MAINTENANCE_SAMPLES: SuperadminSystemAssetMaintenanceSample[] = [
  { name: 'Sample AC Unit - Zone A', qty: 1, status: 'Overdue', lastServiced: '2025-11-15', nextDue: '2026-02-15', daysOverdue: 55 },
  { name: 'Sample Ceiling Fan Batch', qty: 8, status: 'Due Soon', lastServiced: '2026-02-01', nextDue: '2026-10-20', daysOverdue: -9 },
  { name: 'Sample CCTV System', qty: 4, status: 'OK', lastServiced: '2026-03-10', nextDue: '2026-12-10', daysOverdue: -60 },
];

export const SUPERADMIN_SYSTEM_LOCKER_MAINTENANCE_SAMPLES: SuperadminSystemLockerMaintenanceSample[] = [
  { id: 'SAMPLE-L-03', status: 'Issue Reported', lastIssue: 'Sample issue: lock jammed — 2026-10-08' },
  { id: 'SAMPLE-L-11', status: 'OK', lastIssue: 'No sample issue recorded' },
  { id: 'SAMPLE-L-19', status: 'Issue Reported', lastIssue: 'Sample issue: door hinge repair — 2026-10-06' },
];
