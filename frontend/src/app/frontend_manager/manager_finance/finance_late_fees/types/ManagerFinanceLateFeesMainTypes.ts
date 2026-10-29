export type ManagerFinanceLateFeesQueryValue = string | string[] | undefined;

export interface ManagerFinanceLateFeesSearchParams {
  view?: ManagerFinanceLateFeesQueryValue;
  id?: ManagerFinanceLateFeesQueryValue;
  name?: ManagerFinanceLateFeesQueryValue;
  phone?: ManagerFinanceLateFeesQueryValue;
  smartId?: ManagerFinanceLateFeesQueryValue;
}

export interface ManagerFinanceLateFeesMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
