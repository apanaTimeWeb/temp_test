import { ManagerFinanceCollectFeeMain } from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/ManagerFinanceCollectFeeMain';
import type { ManagerFinanceCollectFeeMainProps } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeMainTypes';
import type { ManagerFinanceCollectFeePageProps } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerFinanceCollectFeePage({ searchParams }: ManagerFinanceCollectFeePageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerFinanceCollectFeeMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerFinanceCollectFeeMain {...mainProps} />;
}
