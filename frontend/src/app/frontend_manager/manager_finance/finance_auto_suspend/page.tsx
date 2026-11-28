import { ManagerFinanceAutoSuspendMain } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/components/ManagerFinanceAutoSuspendMain';
import type { ManagerFinanceAutoSuspendPageProps } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendComponentTypes';
import type { ManagerFinanceAutoSuspendMainProps } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendMainTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerFinanceAutoSuspendPage({ searchParams }: ManagerFinanceAutoSuspendPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerFinanceAutoSuspendMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerFinanceAutoSuspendMain view={mainProps.view} id={mainProps.id} name={mainProps.name} phone={mainProps.phone} smartId={mainProps.smartId} />;
}
