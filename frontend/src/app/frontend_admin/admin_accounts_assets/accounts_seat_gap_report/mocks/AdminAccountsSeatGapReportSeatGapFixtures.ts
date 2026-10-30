import type { AdminAccountingSeatGapRow } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/types/AdminAccountsSeatGapReportTypes';

export const ADMIN_ACCOUNTING_SEAT_GAP_FIXTURES: readonly AdminAccountingSeatGapRow[] = [
  { seatNo: 'A-04', shift: 'Morning', floor: 'Ground', lastOccupied: '2026-03-26', gapDays: 16, revenueLoss: 80000, status: 'vacant' },
  { seatNo: 'B-11', shift: 'Afternoon', floor: 'First', lastOccupied: '2026-03-19', gapDays: 23, revenueLoss: 115000, status: 'maintenance' },
  { seatNo: 'C-07', shift: 'Night', floor: 'Second', lastOccupied: '2026-03-22', gapDays: 20, revenueLoss: 100000, status: 'vacant' },
];
