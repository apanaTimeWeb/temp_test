// Canonical domain shell: direct submodule routes own all business screens.
import { redirect } from 'next/navigation';
import { ADMIN_SETTINGS_BRANCHES_CANONICAL_ROUTE } from './settings_branches/config/admin_settings_branches.url_config';

export default function AdminSettingsPage() {
  redirect(ADMIN_SETTINGS_BRANCHES_CANONICAL_ROUTE);
}
