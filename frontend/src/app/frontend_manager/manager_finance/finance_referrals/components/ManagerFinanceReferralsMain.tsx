'use client';
import ManagerFinanceReferralsPage from '@/app/frontend_manager/manager_finance/finance_referrals/components/manager_finance_referrals_views/ManagerFinanceReferralsPage';
import type { ManagerFinanceReferralsMainProps } from '@/app/frontend_manager/manager_finance/finance_referrals/types/ManagerFinanceReferralsMainTypes';

// RESPONSIBILITY: Route query state into the finance referrals feature view.
// DATA FLOW: Next.js route page -> typed Main props -> feature view.

export function ManagerFinanceReferralsMain(props: ManagerFinanceReferralsMainProps) {
  return <ManagerFinanceReferralsPage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
