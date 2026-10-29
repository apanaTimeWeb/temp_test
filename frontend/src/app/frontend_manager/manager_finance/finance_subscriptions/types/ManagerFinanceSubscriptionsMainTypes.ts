export type ManagerFinanceSubscriptionsQueryValue = string | string[] | undefined;

export interface ManagerFinanceSubscriptionsSearchParams {
  view?: ManagerFinanceSubscriptionsQueryValue;
  id?: ManagerFinanceSubscriptionsQueryValue;
  name?: ManagerFinanceSubscriptionsQueryValue;
  phone?: ManagerFinanceSubscriptionsQueryValue;
  smartId?: ManagerFinanceSubscriptionsQueryValue;
}

export interface ManagerFinanceSubscriptionsMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
