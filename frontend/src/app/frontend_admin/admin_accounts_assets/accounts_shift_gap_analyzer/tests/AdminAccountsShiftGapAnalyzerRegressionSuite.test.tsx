import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import AdminAccountingShiftGapSummarySection from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/components/AdminAccountsShiftGapAnalyzerShiftGapSummarySection';
import { filterAdminAccountingDayGaps, filterAdminAccountingShiftGaps, normalizeAdminAccountingShiftFilter, summarizeAdminAccountingShiftGaps } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/utils/AdminAccountsShiftGapAnalyzerShiftGapUtils';
import type { AdminAccountingDayGap, AdminAccountingShiftGap } from '@/app/frontend_admin/admin_accounts_assets/accounts_shift_gap_analyzer/types/AdminAccountsShiftGapAnalyzerTypes';

afterEach(() => cleanup());

describe('AdminAccountingShiftGapSummarySection', () => {
  it('renders shift-gap summary values without recalculating labels in the page view', () => {
    render(<AdminAccountingShiftGapSummarySection totalLossLabel="₹2,500.00" totalVacant={8} averageOccupancy={82} shiftCount={3} labels={{ totalRevenueLoss: 'Total revenue loss', totalVacantSeats: 'Total vacant seats', averageOccupancy: 'Average occupancy', shiftsAnalyzed: 'Shifts analyzed' }} />);
        expect(screen.getByText('₹2,500.00')).toBeTruthy();
        expect(screen.getByText('82%')).toBeTruthy();
  });
});


const shifts: AdminAccountingShiftGap[] = [
  { shift: 'Morning', totalSeats: 10, occupied: 8, vacant: 2, occupancyPct: 80, avgGapDays: 2, revenueLoss: 5000 },
  { shift: 'Night', totalSeats: 10, occupied: 5, vacant: 5, occupancyPct: 50, avgGapDays: 4, revenueLoss: 9000 },
];
const days: AdminAccountingDayGap[] = [
  { date: '2026-10-12', shift: 'Morning', seatNo: 'M-1', gapDays: 2, loss: 5000 },
  { date: '2026-10-12', shift: 'Night', seatNo: 'N-1', gapDays: 4, loss: 9000 },
];

describe('AdminAccountingShiftGapUtils', () => {
  it('normalizes invalid query values to all instead of preserving a stale filter', () => {
    expect(normalizeAdminAccountingShiftFilter('Morning')).toBe('Morning');
    expect(normalizeAdminAccountingShiftFilter('24-Hour')).toBe('24-Hour');
    expect(normalizeAdminAccountingShiftFilter('Unknown')).toBe('all');
    expect(normalizeAdminAccountingShiftFilter(null)).toBe('all');
  });

  it('filters summary and day rows by the same shift identity, including display labels with hours', () => {
    expect(filterAdminAccountingShiftGaps(shifts, 'Morning').map((row) => row.shift)).toEqual(['Morning']);
    expect(filterAdminAccountingShiftGaps([{ shift: '24-Hour', totalSeats: 20, occupied: 19, vacant: 1, occupancyPct: 95, avgGapDays: 5, revenueLoss: 60000 }], '24-Hour')).toHaveLength(1);
    expect(filterAdminAccountingShiftGaps([{ shift: 'Morning (6AM–2PM)', totalSeats: 10, occupied: 8, vacant: 2, occupancyPct: 80, avgGapDays: 2, revenueLoss: 5000 }], 'Morning')).toHaveLength(1);
    expect(filterAdminAccountingDayGaps(days, 'Morning').map((row) => row.seatNo)).toEqual(['M-1']);
    expect(filterAdminAccountingDayGaps(days, 'all')).toHaveLength(2);
  });

  it('derives KPIs from the filtered shift rows and handles an empty selection', () => {
    expect(summarizeAdminAccountingShiftGaps(filterAdminAccountingShiftGaps(shifts, 'Morning'))).toEqual({
      totalRevenueLoss: 5000, totalVacantSeats: 2, averageOccupancy: 80, shiftCount: 1,
    });
    expect(summarizeAdminAccountingShiftGaps([])).toEqual({
      totalRevenueLoss: 0, totalVacantSeats: 0, averageOccupancy: 0, shiftCount: 0,
    });
  });
});
