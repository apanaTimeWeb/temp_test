// Canonical domain shell: direct submodule routes own all business screens.
import { ADMIN_ACCOUNTS_EXPENSES_ROUTES } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/config/admin_accounts_expenses.url_config';
import { redirect } from 'next/navigation';

export default function AdminAccountsAssetsPage() {
  redirect(ADMIN_ACCOUNTS_EXPENSES_ROUTES.route);
}
