'use client';
import ManagerFinanceReceiptsPage from '@/app/frontend_manager/manager_finance/finance_receipts/components/manager_finance_receipts_views/ManagerFinanceReceiptsPage.tsx';
import type { ManagerFinanceReceiptsMainProps } from '@/app/frontend_manager/manager_finance/finance_receipts/types/ManagerFinanceReceiptsMainTypes';

// RESPONSIBILITY: Route query state into the finance receipts feature view.
// DATA FLOW: Next.js route page -> typed Main props -> feature view.

export function ManagerFinanceReceiptsMain(props: ManagerFinanceReceiptsMainProps) {
  return <ManagerFinanceReceiptsPage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
