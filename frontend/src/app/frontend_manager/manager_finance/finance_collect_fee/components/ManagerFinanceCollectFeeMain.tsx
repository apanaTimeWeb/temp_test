'use client';
import ManagerFinanceCollectFeePage from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeePage.tsx';
import type { ManagerFinanceCollectFeeMainProps } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeMainTypes';

export function ManagerFinanceCollectFeeMain(props: ManagerFinanceCollectFeeMainProps) {
  return <ManagerFinanceCollectFeePage
    view={props.view}
    id={props.id}
    name={props.name}
    phone={props.phone}
    smartId={props.smartId}
  />;
}
