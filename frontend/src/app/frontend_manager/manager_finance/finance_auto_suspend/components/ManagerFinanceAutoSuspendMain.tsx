'use client';
import ManagerFinanceAutoSuspendPage from '@/app/frontend_manager/manager_finance/finance_auto_suspend/components/manager_finance_auto_suspend_views/ManagerFinanceAutoSuspendPage';
import type { ManagerFinanceAutoSuspendMainProps } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendMainTypes';

export function ManagerFinanceAutoSuspendMain(props: ManagerFinanceAutoSuspendMainProps) {
  return <ManagerFinanceAutoSuspendPage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
