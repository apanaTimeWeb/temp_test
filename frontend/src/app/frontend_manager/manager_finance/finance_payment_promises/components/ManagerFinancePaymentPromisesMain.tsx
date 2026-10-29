'use client';
import ManagerFinancePaymentPromisesPage from '@/app/frontend_manager/manager_finance/finance_payment_promises/components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesPage.tsx';
import type { ManagerFinancePaymentPromisesMainProps } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesMainTypes';

// RESPONSIBILITY: Route query state into the finance payment promises feature view.
// DATA FLOW: Next.js route page -> typed Main props -> feature view.

export function ManagerFinancePaymentPromisesMain(props: ManagerFinancePaymentPromisesMainProps) {
  return <ManagerFinancePaymentPromisesPage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
