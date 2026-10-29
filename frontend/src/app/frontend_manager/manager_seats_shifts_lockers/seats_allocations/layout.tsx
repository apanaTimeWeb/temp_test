import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/components/manager_seats_allocations_styles/ManagerSeatsAllocationsManager_allocations.css';

export const metadata: Metadata = {
  title: 'Seat Allocations | Library OS',
  description: 'Track member seat assignments, shift tenures, validity periods, and allocation history',
};

export default function SeatsShiftsLockersLayout({ children }: { children: React.ReactNode }) {
  return <div className="ss-theme">{children}</div>;
}
