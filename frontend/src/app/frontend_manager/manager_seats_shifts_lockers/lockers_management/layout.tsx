import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/components/manager_lockers_management_styles/ManagerLockersManagementManager_lockers.css';

export const metadata: Metadata = {
  title: 'Lockers Management | Library OS',
  description: 'Manage library locker allocations, assignments, student locker keys, and maintenance',
};

export default function SeatsShiftsLockersLayout({ children }: { children: React.ReactNode }) {
  return <div className="ss-theme">{children}</div>;
}
