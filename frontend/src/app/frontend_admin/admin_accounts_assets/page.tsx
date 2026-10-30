// Canonical domain shell: direct submodule routes own all business screens.
import { redirect } from 'next/navigation';
import { ADMIN_ACCOUNTS_EXPENSES_ROUTES } from './accounts_expenses/config/admin_accounts_expenses.url_config';

export default function AdminAccountsAssetsPage() {
  redirect(ADMIN_ACCOUNTS_EXPENSES_ROUTES.route);
}
