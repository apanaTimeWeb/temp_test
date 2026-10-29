import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/components/manager_seats_management_styles/ManagerSeatsManagementManager_seats.css';

export const metadata: Metadata = {
  title: 'Seats Management | Library OS',
  description: 'Seat inventory, maintenance status, seat assignments, and branch seat registry',
};

export default function SeatsManagementShiftsLockersLayout({ children }: { children: React.ReactNode }) {
  return <div className="ss-theme">{children}</div>;
}
