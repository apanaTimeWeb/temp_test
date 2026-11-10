import { redirect } from 'next/navigation';

export default async function ManagerLockersMatrixPage() {
  redirect('/frontend_manager/manager_seats_shifts_lockers/lockers_management');
}
