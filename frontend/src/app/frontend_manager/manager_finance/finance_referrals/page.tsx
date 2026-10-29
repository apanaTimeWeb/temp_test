import { ManagerFinanceReferralsMain } from '@/app/frontend_manager/manager_finance/finance_referrals/components/ManagerFinanceReferralsMain';
import type { ManagerFinanceReferralsMainProps } from '@/app/frontend_manager/manager_finance/finance_referrals/types/ManagerFinanceReferralsMainTypes';
import type { ManagerFinanceReferralsPageProps } from '@/app/frontend_manager/manager_finance/finance_referrals/types/ManagerFinanceReferralsComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerFinanceReferralsPage({ searchParams }: ManagerFinanceReferralsPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerFinanceReferralsMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerFinanceReferralsMain {...mainProps} />;
}
