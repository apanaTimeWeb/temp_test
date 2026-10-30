// Canonical domain shell: direct submodule routes own all business screens.
import { redirect } from 'next/navigation';
import { ADMIN_SYSTEM_SETTINGS_ROUTES } from './system_settings/config/admin_system_settings.url_config';

export default function AdminSystemPage() {
  redirect(ADMIN_SYSTEM_SETTINGS_ROUTES.route);
}
