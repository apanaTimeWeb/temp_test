export type ManagerFinanceTrustScoresQueryValue = string | string[] | undefined;

export interface ManagerFinanceTrustScoresSearchParams {
  view?: ManagerFinanceTrustScoresQueryValue;
  id?: ManagerFinanceTrustScoresQueryValue;
  name?: ManagerFinanceTrustScoresQueryValue;
  phone?: ManagerFinanceTrustScoresQueryValue;
  smartId?: ManagerFinanceTrustScoresQueryValue;
}

export interface ManagerFinanceTrustScoresMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
