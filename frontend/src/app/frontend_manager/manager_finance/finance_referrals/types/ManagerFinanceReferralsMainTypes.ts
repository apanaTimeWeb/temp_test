export type ManagerFinanceReferralsQueryValue = string | string[] | undefined;

export interface ManagerFinanceReferralsSearchParams {
  view?: ManagerFinanceReferralsQueryValue;
  id?: ManagerFinanceReferralsQueryValue;
  name?: ManagerFinanceReferralsQueryValue;
  phone?: ManagerFinanceReferralsQueryValue;
  smartId?: ManagerFinanceReferralsQueryValue;
}

export interface ManagerFinanceReferralsMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
