import type useAdminShiftsShiftMigrationPage from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/hooks/useAdminShiftsMigrationShiftMigrationPage';
import type useShiftMigrationPage from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/hooks/useAdminShiftsMigrationShiftMigrationPage';
import type { AdminShiftsMigrationScenario } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/tests/harness/bootstrap';
import type { AdminShiftsMigrationStudent } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/mocks/scenarios/admin_shifts_migration.scenarios';
import type { ReactNode } from 'react';

export interface AdminShiftsShiftMigrationPageViewProps {
  model: ReturnType<typeof useShiftMigrationPage>;
}

export interface AdminShiftsShiftMigrationPageViewStepperSectionProps {
  model: ReturnType<typeof useAdminShiftsShiftMigrationPage>;
}

export type PayMode = 'Cash' | 'UPI' | 'Card';

export interface AdminShiftsShiftMigrationPageViewStepperSectionSTEP1SectionProps {
  model: ReturnType<typeof useAdminShiftsShiftMigrationPage>;
}

export type Student = AdminShiftsMigrationStudent;

export interface AdminShiftsMigrationHarnessProps {
  children: ReactNode;
  scenario?: AdminShiftsMigrationScenario;
}
