// Canonical domain shell: direct submodule routes own all business screens.
import { redirect } from 'next/navigation';
import { ADMIN_DASHBOARD_OVERVIEW_CANONICAL_ROUTE } from './dashboard_overview/config/admin_dashboard_overview.url_config';

export default function AdminDashboardPage() {
  redirect(ADMIN_DASHBOARD_OVERVIEW_CANONICAL_ROUTE);
}
