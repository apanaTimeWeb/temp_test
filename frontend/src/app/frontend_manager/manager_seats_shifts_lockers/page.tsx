import { redirect } from 'next/navigation';

export default function ManagerDomainIndexPage() {
  redirect('/frontend_manager/manager_seats_shifts_lockers/seats_matrix');
}
