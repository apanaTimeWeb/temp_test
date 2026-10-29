'use client';
import ManagerFinanceRefundsPage from '@/app/frontend_manager/manager_finance/finance_refunds/components/manager_finance_refunds_views/ManagerFinanceRefundsPage';
import type { ManagerFinanceRefundsMainProps } from '@/app/frontend_manager/manager_finance/finance_refunds/types/ManagerFinanceRefundsMainTypes';

// RESPONSIBILITY: Route query state into the finance refunds feature view.
// DATA FLOW: Next.js route page -> typed Main props -> feature view.

export function ManagerFinanceRefundsMain(props: ManagerFinanceRefundsMainProps) {
  return <ManagerFinanceRefundsPage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
