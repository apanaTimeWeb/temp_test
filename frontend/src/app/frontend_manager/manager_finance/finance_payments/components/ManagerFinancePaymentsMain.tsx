'use client';
import ManagerFinancePaymentsPage from '@/app/frontend_manager/manager_finance/finance_payments/components/manager_finance_payments_views/ManagerFinancePaymentsPage.tsx';
import type { ManagerFinancePaymentsMainProps } from '@/app/frontend_manager/manager_finance/finance_payments/types/ManagerFinancePaymentsMainTypes';

// RESPONSIBILITY: Route query state into the finance payments feature view.
// DATA FLOW: Next.js route page -> typed Main props -> feature view.

export function ManagerFinancePaymentsMain(props: ManagerFinancePaymentsMainProps) {
  return <ManagerFinancePaymentsPage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
