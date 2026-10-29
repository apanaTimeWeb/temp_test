'use client';
import ManagerFinanceSubscriptionsPage from '@/app/frontend_manager/manager_finance/finance_subscriptions/components/manager_finance_subscriptions_views/ManagerFinanceSubscriptionsPage.tsx';
import type { ManagerFinanceSubscriptionsMainProps } from '@/app/frontend_manager/manager_finance/finance_subscriptions/types/ManagerFinanceSubscriptionsMainTypes';

// RESPONSIBILITY: Route query state into the manager finance finance subscriptions feature view.
// DATA FLOW: Next.js route page -> typed Main props -> feature view.

export function ManagerFinanceSubscriptionsMain(props: ManagerFinanceSubscriptionsMainProps) {
  return <ManagerFinanceSubscriptionsPage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
