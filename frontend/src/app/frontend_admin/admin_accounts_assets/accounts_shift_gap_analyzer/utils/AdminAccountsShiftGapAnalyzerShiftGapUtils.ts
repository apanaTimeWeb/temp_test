import { ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/config/admin_accounts_shift_gap_analyzer.url_config';
import type { AdminAccountingDayGap, AdminAccountingShiftGap } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/types/AdminAccountsShiftGapAnalyzerTypes';

export type AdminAccountingShiftFilter = (typeof ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS)[number];

/** Normalize URL input to the supported shift filter; malformed values always reset to `all`. */
export function normalizeAdminAccountingShiftFilter(value: string | null | undefined): AdminAccountingShiftFilter {
  return ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS.includes(value as AdminAccountingShiftFilter)
    ? value as AdminAccountingShiftFilter
    : 'all';
}

/** Filter summary records using the same selection represented by the URL. */
export function filterAdminAccountingShiftGaps(rows: readonly AdminAccountingShiftGap[], shift: AdminAccountingShiftFilter): AdminAccountingShiftGap[] {
  return shift === 'all' ? [...rows] : rows.filter((row) => row.shift === shift || row.shift.split(' (')[0] === shift);
}

/** Filter day-level detail rows using the same normalized shift. */
export function filterAdminAccountingDayGaps(rows: readonly AdminAccountingDayGap[], shift: AdminAccountingShiftFilter): AdminAccountingDayGap[] {
  return shift === 'all' ? [...rows] : rows.filter((row) => row.shift === shift || row.shift.split(' (')[0] === shift);
}

/** Compute KPI totals from the visible shifts so the summary agrees with the selected filter. */
export function summarizeAdminAccountingShiftGaps(rows: readonly AdminAccountingShiftGap[]) {
  const totalRevenueLoss = rows.reduce((sum, row) => sum + row.revenueLoss, 0);
  const totalVacantSeats = rows.reduce((sum, row) => sum + row.vacant, 0);
  const averageOccupancy = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.occupancyPct, 0) / rows.length) : 0;
  return { totalRevenueLoss, totalVacantSeats, averageOccupancy, shiftCount: rows.length };
}
