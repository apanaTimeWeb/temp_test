'use client';
import ManagerFinanceRenewalsPage from '@/app/frontend_manager/manager_finance/finance_renewals/components/manager_finance_renewals_views/ManagerFinanceRenewalsPage';
import type { ManagerFinanceRenewalsMainProps } from '@/app/frontend_manager/manager_finance/finance_renewals/types/ManagerFinanceRenewalsMainTypes';

// RESPONSIBILITY: Route query state into the manager finance finance renewals feature view.
// DATA FLOW: Next.js route page -> typed Main props -> feature view.

export function ManagerFinanceRenewalsMain(props: ManagerFinanceRenewalsMainProps) {
  return <ManagerFinanceRenewalsPage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
