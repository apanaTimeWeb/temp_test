import { ManagerFinanceLateFeesMain } from '@/app/frontend_manager/manager_finance/finance_late_fees/components/ManagerFinanceLateFeesMain';
import type { ManagerFinanceLateFeesMainProps } from '@/app/frontend_manager/manager_finance/finance_late_fees/types/ManagerFinanceLateFeesMainTypes';
import type { ManagerFinanceLateFeesPageProps } from '@/app/frontend_manager/manager_finance/finance_late_fees/types/ManagerFinanceLateFeesComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerFinanceLateFeesPage({ searchParams }: ManagerFinanceLateFeesPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerFinanceLateFeesMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerFinanceLateFeesMain {...mainProps} />;
}
