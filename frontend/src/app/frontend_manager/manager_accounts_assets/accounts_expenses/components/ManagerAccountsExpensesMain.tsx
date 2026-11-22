'use client';
import ManagerAccountsExpensesPage from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_views/ManagerAccountsExpensesPage';
import type { ManagerAccountsExpensesMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesMainTypes';

export function ManagerAccountsExpensesMain(props: ManagerAccountsExpensesMainProps) {
  return <ManagerAccountsExpensesPage view={props.view} id={props.id} />;
}
