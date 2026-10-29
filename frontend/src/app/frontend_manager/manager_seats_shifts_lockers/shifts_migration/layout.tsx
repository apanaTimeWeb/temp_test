import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/components/manager_shifts_migration_styles/ManagerShiftsMigrationManager_shift_migration.css';

export const metadata: Metadata = {
  title: 'Shift Migration | Library OS',
  description: 'Migrate students between library shifts, recalculate prorated balance and seat reassignment',
};

export default function SeatsShiftsLockersLayout({ children }: { children: React.ReactNode }) {
  return <div className="ss-theme">{children}</div>;
}
