import { ManagerFinanceSecurityDepositsMain } from '@/app/frontend_manager/manager_finance/finance_security_deposits/components/ManagerFinanceSecurityDepositsMain';
import type { ManagerFinanceSecurityDepositsMainProps } from '@/app/frontend_manager/manager_finance/finance_security_deposits/types/ManagerFinanceSecurityDepositsMainTypes';
import type { ManagerFinanceSecurityDepositsPageProps } from '@/app/frontend_manager/manager_finance/finance_security_deposits/types/ManagerFinanceSecurityDepositsComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerFinanceSecurityDepositsPage({ searchParams }: ManagerFinanceSecurityDepositsPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerFinanceSecurityDepositsMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerFinanceSecurityDepositsMain {...mainProps} />;
}
