export type ManagerFinanceRefundsQueryValue = string | string[] | undefined;

export interface ManagerFinanceRefundsSearchParams {
  view?: ManagerFinanceRefundsQueryValue;
  id?: ManagerFinanceRefundsQueryValue;
  name?: ManagerFinanceRefundsQueryValue;
  phone?: ManagerFinanceRefundsQueryValue;
  smartId?: ManagerFinanceRefundsQueryValue;
}

export interface ManagerFinanceRefundsMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
