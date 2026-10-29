import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_styles/ManagerSeatsMatrixManager_seat_matrix.css';

export const metadata: Metadata = {
  title: 'Seat Matrix | Library OS',
  description: 'Interactive visual seat grid, occupancy map, and shift allocation management',
};

export default function SeatsShiftsLockersLayout({ children }: { children: React.ReactNode }) {
  return <div className="ss-theme">{children}</div>;
}
