import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_styles/ManagerSeatsHistoryManager_seat_history.css';

export const metadata: Metadata = {
  title: 'Seat History | Library OS',
  description: 'Historical audit log of seat occupancy, past student assignments, and vacancy periods',
};

export default function SeatsShiftsLockersLayout({ children }: { children: React.ReactNode }) {
  return <div className="ss-theme">{children}</div>;
}
