import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/components/manager_shifts_management_styles/ManagerShiftsManagementManager_shifts.css';

export const metadata: Metadata = {
  title: 'Shifts Management | Library OS',
  description: 'Manage library operational shifts, schedules, time slots, and capacity thresholds',
};

export default function SeatsShiftsLockersLayout({ children }: { children: React.ReactNode }) {
  return <div className="ss-theme">{children}</div>;
}
