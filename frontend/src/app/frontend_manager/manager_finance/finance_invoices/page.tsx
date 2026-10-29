import { ManagerFinanceInvoicesMain } from '@/app/frontend_manager/manager_finance/finance_invoices/components/ManagerFinanceInvoicesMain';
import type { ManagerFinanceInvoicesMainProps } from '@/app/frontend_manager/manager_finance/finance_invoices/types/ManagerFinanceInvoicesMainTypes';
import type { ManagerFinanceInvoicesPageProps } from '@/app/frontend_manager/manager_finance/finance_invoices/types/ManagerFinanceInvoicesComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerFinanceInvoicesPage({ searchParams }: ManagerFinanceInvoicesPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerFinanceInvoicesMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerFinanceInvoicesMain {...mainProps} />;
}
