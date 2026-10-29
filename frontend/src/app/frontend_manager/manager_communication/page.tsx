import { redirect } from 'next/navigation';

export default function ManagerDomainIndexPage() {
  redirect('/frontend_manager/manager_communication/communication_notices');
}
