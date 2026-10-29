import { ManagerFinancePaymentPromisesMain } from '@/app/frontend_manager/manager_finance/finance_payment_promises/components/ManagerFinancePaymentPromisesMain';
import type { ManagerFinancePaymentPromisesMainProps } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesMainTypes';
import type { ManagerFinancePaymentPromisesPageProps } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerFinancePaymentPromisesPage({ searchParams }: ManagerFinancePaymentPromisesPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerFinancePaymentPromisesMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerFinancePaymentPromisesMain {...mainProps} />;
}
