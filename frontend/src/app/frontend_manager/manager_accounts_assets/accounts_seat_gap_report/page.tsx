import { ManagerAccountsSeatGapReportMain } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/ManagerAccountsSeatGapReportMain';
import type { ManagerAccountsSeatGapReportMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/types/ManagerAccountsSeatGapReportMainTypes';
import type { ManagerAccountsSeatGapReportPageProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/types/ManagerAccountsSeatGapReportComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerAccountsSeatGapReportPage({ searchParams }: ManagerAccountsSeatGapReportPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerAccountsSeatGapReportMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
  };
  return <ManagerAccountsSeatGapReportMain {...mainProps} />;
}
