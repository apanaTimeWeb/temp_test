import { ManagerFinanceRefundsMain } from '@/app/frontend_manager/manager_finance/finance_refunds/components/ManagerFinanceRefundsMain';
import type { ManagerFinanceRefundsMainProps } from '@/app/frontend_manager/manager_finance/finance_refunds/types/ManagerFinanceRefundsMainTypes';
import type { ManagerFinanceRefundsPageProps } from '@/app/frontend_manager/manager_finance/finance_refunds/types/ManagerFinanceRefundsComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerFinanceRefundsPage({ searchParams }: ManagerFinanceRefundsPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerFinanceRefundsMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerFinanceRefundsMain {...mainProps} />;
}
