export type ManagerFinanceRenewalsQueryValue = string | string[] | undefined;

export interface ManagerFinanceRenewalsSearchParams {
  view?: ManagerFinanceRenewalsQueryValue;
  id?: ManagerFinanceRenewalsQueryValue;
  name?: ManagerFinanceRenewalsQueryValue;
  phone?: ManagerFinanceRenewalsQueryValue;
  smartId?: ManagerFinanceRenewalsQueryValue;
}

export interface ManagerFinanceRenewalsMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
