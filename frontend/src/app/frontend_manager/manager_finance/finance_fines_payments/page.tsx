import { ManagerFinanceFinesPaymentsMain } from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/ManagerFinanceFinesPaymentsMain';
import type { ManagerFinanceFinesPaymentsMainProps } from '@/app/frontend_manager/manager_finance/finance_fines_payments/types/ManagerFinanceFinesPaymentsMainTypes';
import type { ManagerFinanceFinesPaymentsPageProps } from '@/app/frontend_manager/manager_finance/finance_fines_payments/types/ManagerFinanceFinesPaymentsComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerFinanceFinesPaymentsPage({ searchParams }: ManagerFinanceFinesPaymentsPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerFinanceFinesPaymentsMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerFinanceFinesPaymentsMain {...mainProps} />;
}
