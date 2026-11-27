import type { AdminAccountsSeatGapReportScenario } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export type AdminAccountingSeatGapRowStatus = 'vacant' | 'maintenance';

export interface AdminAccountingSeatGapRow {
  seatNo: string;
  shift: string;
  floor: string;
  lastOccupied: string;
  gapDays: number;
  revenueLoss: number;
  status: AdminAccountingSeatGapRowStatus;
  branch?: string;
}

export interface AdminAccountsSeatGapReportHarnessProps {
  children: ReactNode;
  scenario?: AdminAccountsSeatGapReportScenario;
}
