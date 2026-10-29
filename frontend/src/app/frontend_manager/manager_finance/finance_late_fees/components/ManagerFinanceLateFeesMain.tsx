'use client';
import ManagerFinanceLateFeesPage from '@/app/frontend_manager/manager_finance/finance_late_fees/components/manager_finance_late_fees_views/ManagerFinanceLateFeesPage.tsx';
import type { ManagerFinanceLateFeesMainProps } from '@/app/frontend_manager/manager_finance/finance_late_fees/types/ManagerFinanceLateFeesMainTypes';

// RESPONSIBILITY: Route query state into the finance late fees feature view.
// DATA FLOW: Next.js route page -> typed Main props -> feature view.

export function ManagerFinanceLateFeesMain(props: ManagerFinanceLateFeesMainProps) {
  return <ManagerFinanceLateFeesPage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
