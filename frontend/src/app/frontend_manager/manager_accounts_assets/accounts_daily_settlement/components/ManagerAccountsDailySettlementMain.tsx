'use client';
import ManagerAccountsDailySettlementPage from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/components/manager_accounts_daily_settlement_views/ManagerAccountsDailySettlementPage.tsx';
import type { ManagerAccountsDailySettlementMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/types/ManagerAccountsDailySettlementMainTypes';

export function ManagerAccountsDailySettlementMain(props: ManagerAccountsDailySettlementMainProps) {
  return <ManagerAccountsDailySettlementPage view={props.view} id={props.id} />;
}
