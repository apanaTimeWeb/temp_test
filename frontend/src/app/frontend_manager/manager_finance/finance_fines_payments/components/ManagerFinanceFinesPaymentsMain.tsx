'use client';
import ManagerFinanceFinesPaymentsFinesAndPaymentsPage from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsFinesAndPaymentsPage';
import type { ManagerFinanceFinesPaymentsMainProps } from '@/app/frontend_manager/manager_finance/finance_fines_payments/types/ManagerFinanceFinesPaymentsMainTypes';

// RESPONSIBILITY: Route query state into the finance fines payments feature view.
// DATA FLOW: Next.js route page -> typed Main props -> feature view.

export function ManagerFinanceFinesPaymentsMain(props: ManagerFinanceFinesPaymentsMainProps) {
  return <ManagerFinanceFinesPaymentsFinesAndPaymentsPage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
