import type { AdminLockersDemoLocker, AdminLockersDemoLockerStatus } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/mocks/AdminLockersManagementMSWHandlers';
import type { AdminLockersManagementScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export type LockerStatus = AdminLockersDemoLockerStatus;

export type Locker = AdminLockersDemoLocker;

export interface AdminLockersManagementHarnessProps {
  children: ReactNode;
  scenario?: AdminLockersManagementScenario;
}
