import { redirect } from 'next/navigation';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

export default function UsersOverviewRoutePage() {
  redirect(SUPERADMIN_NAVIGATION_ROUTES.users_directory);
}
