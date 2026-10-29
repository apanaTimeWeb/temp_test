export type ManagerFinanceReceiptsQueryValue = string | string[] | undefined;

export interface ManagerFinanceReceiptsSearchParams {
  view?: ManagerFinanceReceiptsQueryValue;
  id?: ManagerFinanceReceiptsQueryValue;
  name?: ManagerFinanceReceiptsQueryValue;
  phone?: ManagerFinanceReceiptsQueryValue;
  smartId?: ManagerFinanceReceiptsQueryValue;
}

export interface ManagerFinanceReceiptsMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
