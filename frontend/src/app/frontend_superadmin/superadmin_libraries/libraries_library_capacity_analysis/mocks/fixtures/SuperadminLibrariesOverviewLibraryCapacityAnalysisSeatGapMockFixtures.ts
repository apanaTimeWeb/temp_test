// RESPONSIBILITY: Define local sample fixtures for libraries library capacity analysis; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_libraries/libraries_library_capacity_analysis/mocks/fixtures/SuperadminLibrariesOverviewLibraryCapacityAnalysisSeatGapMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminAccountingSeatGapRow } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/types/SuperadminLibrariesOverviewLibraryCapacityAnalysisSeatGapTypes';

/** Synthetic seat-gap estimates for front-end preview only. */
export const SUPERADMIN_ACCOUNTING_SAMPLE_SEAT_GAPS: readonly SuperadminAccountingSeatGapRow[] = [
  { seatNo: 'A-04', shift: 'Morning', floor: 'COPY.GROUND_FLOOR', lastOccupied: '2026-03-28', gapDays: 14, revenueLoss: 700, status: 'vacant' },
  { seatNo: 'B-11', shift: 'Afternoon', floor: 'COPY.FIRST_FLOOR', lastOccupied: '2026-03-20', gapDays: 22, revenueLoss: 1100, status: 'vacant' },
  { seatNo: 'C-07', shift: 'Night', floor: 'COPY.GROUND_FLOOR', lastOccupied: '2026-04-01', gapDays: 10, revenueLoss: 500, status: 'maintenance' },
  { seatNo: 'A-09', shift: 'Morning', floor: 'COPY.FIRST_FLOOR', lastOccupied: '2026-03-15', gapDays: 27, revenueLoss: 1350, status: 'vacant' },
  { seatNo: 'D-02', shift: 'Afternoon', floor: 'COPY.SECOND_FLOOR', lastOccupied: '2026-04-05', gapDays: 6, revenueLoss: 300, status: 'vacant' },
  { seatNo: 'B-15', shift: 'Morning', floor: 'COPY.GROUND_FLOOR', lastOccupied: '2026-03-10', gapDays: 32, revenueLoss: 1600, status: 'vacant' },
];
