// RESPONSIBILITY: Define local sample fixtures for libraries library shift gap analysis; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_libraries/libraries_library_shift_gap_analysis/mocks/fixtures/SuperadminLibrariesOverviewLibraryShiftGapAnalysisShiftGapMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminAccountingShiftGapDay, SuperadminAccountingShiftGapSummary } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_shift_gap_analysis/types/SuperadminLibrariesOverviewLibraryShiftGapAnalysisShiftGapTypes';

/** Synthetic utilization and day-gap estimates for preview only. */
export const SUPERADMIN_ACCOUNTING_SAMPLE_SHIFT_GAP_SUMMARIES: readonly SuperadminAccountingShiftGapSummary[] = [
  { shift: 'Morning (6AM–2PM)', totalSeats: 40, occupied: 34, vacant: 6, occupancyPct: 85, avgGapDays: 12, revenueLoss: 3600 },
  { shift: 'Afternoon (2PM–9PM)', totalSeats: 40, occupied: 28, vacant: 12, occupancyPct: 70, avgGapDays: 18, revenueLoss: 7200 },
  { shift: 'Night (9PM–6AM)', totalSeats: 30, occupied: 18, vacant: 12, occupancyPct: 60, avgGapDays: 24, revenueLoss: 8640 },
  { shift: '24-Hour', totalSeats: 20, occupied: 19, vacant: 1, occupancyPct: 95, avgGapDays: 5, revenueLoss: 600 },
];
export const SUPERADMIN_ACCOUNTING_SAMPLE_SHIFT_GAP_DAYS: readonly SuperadminAccountingShiftGapDay[] = [
  { date: '2026-04-10', shift: 'Afternoon', seatNo: 'B-11', gapDays: 22, loss: 1100 },
  { date: '2026-04-09', shift: 'Night', seatNo: 'C-07', gapDays: 18, loss: 900 },
  { date: '2026-04-08', shift: 'Morning', seatNo: 'A-04', gapDays: 14, loss: 700 },
  { date: '2026-04-07', shift: 'Night', seatNo: 'C-12', gapDays: 30, loss: 1500 },
  { date: '2026-04-06', shift: 'Afternoon', seatNo: 'B-03', gapDays: 9, loss: 450 },
];
