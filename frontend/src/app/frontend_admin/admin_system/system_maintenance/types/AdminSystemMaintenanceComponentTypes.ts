import type { AdminSystemMaintenanceAssetFixture, AdminSystemMaintenanceLockerFixture, AdminSystemMaintenanceSeatFixture } from '@/app/frontend_admin/admin_system/system_maintenance/mocks/AdminSystemMaintenanceFixtures';
import type { AdminSystemMaintenanceScenario } from '@/app/frontend_admin/admin_system/system_maintenance/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminSystemMaintenanceAssetsSectionProps {
  assets: readonly AdminSystemMaintenanceAssetFixture[];
}

export interface AdminSystemMaintenanceLockersSectionProps {
  lockers: readonly AdminSystemMaintenanceLockerFixture[];
}

export interface AdminSystemMaintenanceSeatsSectionProps {
  seats: readonly AdminSystemMaintenanceSeatFixture[];
}

export interface AdminSystemMaintenanceHarnessProps {
  children: ReactNode;
  scenario?: AdminSystemMaintenanceScenario;
}

export type AdminSystemMaintenanceAssetFixtureNameKey = 'ASSET_AC_UNIT' | 'ASSET_CEILING_FAN' | 'ASSET_CCTV';
export type AdminSystemMaintenanceLockerFixtureIssueKey = 'LOCKER_ISSUE_JAM' | 'LOCKER_ISSUE_HINGE' | 'LOCKER_ISSUE_NONE';
