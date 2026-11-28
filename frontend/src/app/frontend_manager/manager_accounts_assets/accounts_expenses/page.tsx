import { ManagerAccountsExpensesMain } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/ManagerAccountsExpensesMain';
import type { ManagerAccountsExpensesPageProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';
import type { ManagerAccountsExpensesMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesMainTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerAccountsExpensesPage({ searchParams }: ManagerAccountsExpensesPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerAccountsExpensesMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
  };
  return <ManagerAccountsExpensesMain view={mainProps.view} id={mainProps.id} />;
}
