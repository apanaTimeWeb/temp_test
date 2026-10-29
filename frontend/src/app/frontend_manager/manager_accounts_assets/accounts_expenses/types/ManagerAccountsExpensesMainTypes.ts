export type ManagerAccountsExpensesQueryValue = string | string[] | undefined;

export interface ManagerAccountsExpensesSearchParams {
  view?: ManagerAccountsExpensesQueryValue;
  id?: ManagerAccountsExpensesQueryValue;
  name?: ManagerAccountsExpensesQueryValue;
  phone?: ManagerAccountsExpensesQueryValue;
  smartId?: ManagerAccountsExpensesQueryValue;
}

export interface ManagerAccountsExpensesMainProps {
  view?: string;
  id?: string;
}
