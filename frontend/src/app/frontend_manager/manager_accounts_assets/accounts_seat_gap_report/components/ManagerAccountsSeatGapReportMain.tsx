'use client';
import ManagerAccountsSeatGapReportPage from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/components/manager_accounts_seat_gap_report_views/ManagerAccountsSeatGapReportPage.tsx';
import type { ManagerAccountsSeatGapReportMainProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/types/ManagerAccountsSeatGapReportMainTypes';

export function ManagerAccountsSeatGapReportMain(props: ManagerAccountsSeatGapReportMainProps) {
  return <ManagerAccountsSeatGapReportPage view={props.view} id={props.id} />;
}
