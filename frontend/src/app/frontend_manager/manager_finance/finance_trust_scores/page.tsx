import { ManagerFinanceTrustScoresMain } from '@/app/frontend_manager/manager_finance/finance_trust_scores/components/ManagerFinanceTrustScoresMain';
import type { ManagerFinanceTrustScoresMainProps } from '@/app/frontend_manager/manager_finance/finance_trust_scores/types/ManagerFinanceTrustScoresMainTypes';
import type { ManagerFinanceTrustScoresPageProps } from '@/app/frontend_manager/manager_finance/finance_trust_scores/types/ManagerFinanceTrustScoresComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerFinanceTrustScoresPage({ searchParams }: ManagerFinanceTrustScoresPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerFinanceTrustScoresMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerFinanceTrustScoresMain {...mainProps} />;
}
