// Canonical domain shell: direct submodule routes own all business screens.
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import { redirect } from 'next/navigation';

export default function AdminSettingsPage() {
  redirect(ADMIN_ROUTES.SETTINGS_PROFILE);
}
