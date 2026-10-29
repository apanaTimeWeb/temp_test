import { ManagerFinanceRenewalsMain } from '@/app/frontend_manager/manager_finance/finance_renewals/components/ManagerFinanceRenewalsMain';
import type { ManagerFinanceRenewalsMainProps } from '@/app/frontend_manager/manager_finance/finance_renewals/types/ManagerFinanceRenewalsMainTypes';
import type { ManagerFinanceRenewalsPageProps } from '@/app/frontend_manager/manager_finance/finance_renewals/types/ManagerFinanceRenewalsComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerFinanceRenewalsPage({ searchParams }: ManagerFinanceRenewalsPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerFinanceRenewalsMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerFinanceRenewalsMain {...mainProps} />;
}
