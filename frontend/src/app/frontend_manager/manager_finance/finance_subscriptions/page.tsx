import { ManagerFinanceSubscriptionsMain } from '@/app/frontend_manager/manager_finance/finance_subscriptions/components/ManagerFinanceSubscriptionsMain';
import type { ManagerFinanceSubscriptionsMainProps } from '@/app/frontend_manager/manager_finance/finance_subscriptions/types/ManagerFinanceSubscriptionsMainTypes';
import type { ManagerFinanceSubscriptionsPageProps } from '@/app/frontend_manager/manager_finance/finance_subscriptions/types/ManagerFinanceSubscriptionsComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerFinanceSubscriptionsPage({ searchParams }: ManagerFinanceSubscriptionsPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerFinanceSubscriptionsMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerFinanceSubscriptionsMain {...mainProps} />;
}
