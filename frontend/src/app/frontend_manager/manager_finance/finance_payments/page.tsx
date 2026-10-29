import { ManagerFinancePaymentsMain } from '@/app/frontend_manager/manager_finance/finance_payments/components/ManagerFinancePaymentsMain';
import type { ManagerFinancePaymentsMainProps } from '@/app/frontend_manager/manager_finance/finance_payments/types/ManagerFinancePaymentsMainTypes';
import type { ManagerFinancePaymentsPageProps } from '@/app/frontend_manager/manager_finance/finance_payments/types/ManagerFinancePaymentsComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerFinancePaymentsPage({ searchParams }: ManagerFinancePaymentsPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerFinancePaymentsMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerFinancePaymentsMain {...mainProps} />;
}
