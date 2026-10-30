import type { AdminAccountingShiftGap, AdminAccountingDayGap } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/types/AdminAccountsShiftGapAnalyzerTypes';

export const ADMIN_ACCOUNTING_SHIFT_GAP_FIXTURES: readonly AdminAccountingShiftGap[] = [
  { shift: 'Morning (6AM–2PM)', totalSeats: 40, occupied: 34, vacant: 6, occupancyPct: 85, avgGapDays: 12, revenueLoss: 360000 },
  { shift: 'Afternoon (2PM–9PM)', totalSeats: 40, occupied: 28, vacant: 12, occupancyPct: 70, avgGapDays: 18, revenueLoss: 720000 },
  { shift: 'Night (9PM–6AM)', totalSeats: 30, occupied: 18, vacant: 12, occupancyPct: 60, avgGapDays: 24, revenueLoss: 864000 },
  { shift: '24-Hour', totalSeats: 20, occupied: 19, vacant: 1, occupancyPct: 95, avgGapDays: 5, revenueLoss: 60000 },
];

export const ADMIN_ACCOUNTING_DAY_GAP_FIXTURES: readonly AdminAccountingDayGap[] = [
  { date: '2026-04-10', shift: 'Afternoon', seatNo: 'B-11', gapDays: 22, loss: 110000 },
  { date: '2026-04-09', shift: 'Night', seatNo: 'C-07', gapDays: 18, loss: 90000 },
  { date: '2026-04-08', shift: 'Morning', seatNo: 'A-04', gapDays: 14, loss: 70000 },
  { date: '2026-04-07', shift: 'Night', seatNo: 'C-12', gapDays: 30, loss: 150000 },
  { date: '2026-04-06', shift: 'Afternoon', seatNo: 'B-03', gapDays: 9, loss: 45000 },
];
