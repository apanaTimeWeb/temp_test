'use client';
import ManagerFinanceTrustScoresTrustScorePage from '@/app/frontend_manager/manager_finance/finance_trust_scores/components/manager_finance_trust_scores_views/ManagerFinanceTrustScoresTrustScorePage';
import type { ManagerFinanceTrustScoresMainProps } from '@/app/frontend_manager/manager_finance/finance_trust_scores/types/ManagerFinanceTrustScoresMainTypes';

// RESPONSIBILITY: Route query state into the manager finance finance trust scores feature view.
// DATA FLOW: Next.js route page -> typed Main props -> feature view.

export function ManagerFinanceTrustScoresMain(props: ManagerFinanceTrustScoresMainProps) {
  return <ManagerFinanceTrustScoresTrustScorePage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
