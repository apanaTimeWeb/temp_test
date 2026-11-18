import { redirect } from 'next/navigation';
import { ADMIN_SETTINGS_PROFILE_ROUTES } from '@/app/frontend_admin/admin_settings/settings_profile/config/admin_settings_profile.url_config';

/** Canonical route entry for merged Profile & Security. */
export default function AdminSettingsSecurityPage() {
  redirect(ADMIN_SETTINGS_PROFILE_ROUTES.ROOT);
}
