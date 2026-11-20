// RESPONSIBILITY: Adapt the canonical route for support complaints; redirects immediately to SaaS software tickets because student facility grievances are handled at branch level.
import { redirect } from 'next/navigation';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

export default async function SuperadminSupportComplaintsRoutePage() {
  redirect(SUPERADMIN_NAVIGATION_ROUTES.support_tickets);
}
