import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/components/manager_lockers_matrix_styles/ManagerLockersMatrixManager_locker_matrix.css';

export const metadata: Metadata = {
  title: 'Locker Matrix | Library OS',
  description: 'Interactive visual locker grid, locker bay occupancy status, and maintenance mapping',
};

export default function SeatsShiftsLockersLayout({ children }: { children: React.ReactNode }) {
  return <div className="ss-theme">{children}</div>;
}
