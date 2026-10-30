import { AdminAccountsExpensesPage } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesPage';
import type { AdminAccountsExpensesRouteView } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/components/AdminAccountsExpensesPage';
import type { RouteSearchParams } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';


const first = (value: string | string[] | undefined): string | undefined => Array.isArray(value) ? value[0] : value;

export default async function AdminAccountsAssetsAccountsExpensesRoute({ searchParams }: { searchParams?: Promise<RouteSearchParams> }) {
  const query = searchParams ? await searchParams : {};
  const rawView = first(query.view);
  const view: AdminAccountsExpensesRouteView = rawView === 'add' || rawView === 'expenses/add' ? 'add' : 'list';
  return <AdminAccountsExpensesPage view={view} />;
}
