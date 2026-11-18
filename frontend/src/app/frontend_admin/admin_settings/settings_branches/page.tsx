import { redirect } from 'next/navigation';
import { ADMIN_SETTINGS_PROFILE_ROUTES } from '@/app/frontend_admin/admin_settings/settings_profile/config/admin_settings_profile.url_config';

/** Redirect to merged active branches view in Settings Profile. */
export default function AdminSettingsBranchesRoute() {
  redirect(`${ADMIN_SETTINGS_PROFILE_ROUTES.ROOT}?view=branches`);
}
