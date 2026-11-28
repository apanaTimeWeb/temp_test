import type { ReactNode } from 'react';

export type AdminAccountsSeatGapReportScenario = 'ACTIVE' | 'EMPTY' | 'SERVER_500' | 'TIMEOUT' | 'UNAUTHORIZED';

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
