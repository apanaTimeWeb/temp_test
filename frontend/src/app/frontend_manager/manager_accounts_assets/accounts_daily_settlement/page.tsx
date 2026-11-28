import { ManagerAccountsDailySettlementMain } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/ManagerAccountsDailySettlementMain';
import type { ManagerAccountsDailySettlementPageProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/types/ManagerAccountsDailySettlementComponentTypes';
import type { ManagerAccountsDailySettlementMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/types/ManagerAccountsDailySettlementMainTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerAccountsDailySettlementPage({ searchParams }: ManagerAccountsDailySettlementPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerAccountsDailySettlementMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
  };
  return <ManagerAccountsDailySettlementMain view={mainProps.view} id={mainProps.id} />;
}
