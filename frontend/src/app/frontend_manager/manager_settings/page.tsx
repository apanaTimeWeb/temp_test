import { redirect } from 'next/navigation';

export default function ManagerDomainIndexPage() {
  redirect('/frontend_manager/manager_settings/settings_branch_info');
}
