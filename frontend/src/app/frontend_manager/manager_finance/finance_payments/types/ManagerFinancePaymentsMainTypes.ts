export type ManagerFinancePaymentsQueryValue = string | string[] | undefined;

export interface ManagerFinancePaymentsSearchParams {
  view?: ManagerFinancePaymentsQueryValue;
  id?: ManagerFinancePaymentsQueryValue;
  name?: ManagerFinancePaymentsQueryValue;
  phone?: ManagerFinancePaymentsQueryValue;
  smartId?: ManagerFinancePaymentsQueryValue;
}

export interface ManagerFinancePaymentsMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
