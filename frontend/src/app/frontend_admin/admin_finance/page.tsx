// Canonical domain shell: direct submodule routes own all business screens.
import { redirect } from 'next/navigation';
import { ADMIN_FINANCE_DASHBOARD_CANONICAL_ROUTE } from './finance_dashboard/config/admin_finance_dashboard.url_config';

export default function AdminFinancePage() {
  redirect(ADMIN_FINANCE_DASHBOARD_CANONICAL_ROUTE);
}
