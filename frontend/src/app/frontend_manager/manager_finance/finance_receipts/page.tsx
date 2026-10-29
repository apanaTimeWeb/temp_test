import { ManagerFinanceReceiptsMain } from '@/app/frontend_manager/manager_finance/finance_receipts/components/ManagerFinanceReceiptsMain';
import type { ManagerFinanceReceiptsMainProps } from '@/app/frontend_manager/manager_finance/finance_receipts/types/ManagerFinanceReceiptsMainTypes';
import type { ManagerFinanceReceiptsPageProps } from '@/app/frontend_manager/manager_finance/finance_receipts/types/ManagerFinanceReceiptsComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerFinanceReceiptsPage({ searchParams }: ManagerFinanceReceiptsPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerFinanceReceiptsMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerFinanceReceiptsMain {...mainProps} />;
}
