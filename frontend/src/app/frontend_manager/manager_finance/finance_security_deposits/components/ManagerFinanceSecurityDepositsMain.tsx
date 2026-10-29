'use client';
import ManagerFinanceSecurityDepositsPage from '@/app/frontend_manager/manager_finance/finance_security_deposits/components/manager_finance_security_deposits_views/ManagerFinanceSecurityDepositsPage.tsx';
import type { ManagerFinanceSecurityDepositsMainProps } from '@/app/frontend_manager/manager_finance/finance_security_deposits/types/ManagerFinanceSecurityDepositsMainTypes';

// RESPONSIBILITY: Route query state into the manager finance finance security deposits feature view.
// DATA FLOW: Next.js route page -> typed Main props -> feature view.

export function ManagerFinanceSecurityDepositsMain(props: ManagerFinanceSecurityDepositsMainProps) {
  return <ManagerFinanceSecurityDepositsPage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
