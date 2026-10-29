'use client';
import ManagerFinanceInvoicesPage from '@/app/frontend_manager/manager_finance/finance_invoices/components/manager_finance_invoices_views/ManagerFinanceInvoicesPage.tsx';
import type { ManagerFinanceInvoicesMainProps } from '@/app/frontend_manager/manager_finance/finance_invoices/types/ManagerFinanceInvoicesMainTypes';

// RESPONSIBILITY: Route query state into the finance invoices feature view.
// DATA FLOW: Next.js route page -> typed Main props -> feature view.

export function ManagerFinanceInvoicesMain(props: ManagerFinanceInvoicesMainProps) {
  return <ManagerFinanceInvoicesPage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
