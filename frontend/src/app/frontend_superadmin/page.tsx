import { redirect } from 'next/navigation';

export default function FrontendSuperadminIndexPage() {
  redirect('/superadmin/superadmin_dashboard/dashboard_overview');
}
