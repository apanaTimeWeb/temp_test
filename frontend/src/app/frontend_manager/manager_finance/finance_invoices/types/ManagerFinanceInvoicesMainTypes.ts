export type ManagerFinanceInvoicesQueryValue = string | string[] | undefined;

export interface ManagerFinanceInvoicesSearchParams {
  view?: ManagerFinanceInvoicesQueryValue;
  id?: ManagerFinanceInvoicesQueryValue;
  name?: ManagerFinanceInvoicesQueryValue;
  phone?: ManagerFinanceInvoicesQueryValue;
  smartId?: ManagerFinanceInvoicesQueryValue;
}

export interface ManagerFinanceInvoicesMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
