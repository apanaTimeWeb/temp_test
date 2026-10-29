import { ManagerFinanceAutoSuspendMain } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/components/ManagerFinanceAutoSuspendMain';
import type { ManagerFinanceAutoSuspendMainProps } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendMainTypes';
import type { ManagerFinanceAutoSuspendPageProps } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendComponentTypes';



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
  return <ManagerFinanceAutoSuspendMain {...mainProps} />;
}
