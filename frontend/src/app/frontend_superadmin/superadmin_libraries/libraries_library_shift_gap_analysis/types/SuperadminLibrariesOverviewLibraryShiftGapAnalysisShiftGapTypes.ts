// FLOW: Feature source -> superadmin_libraries/libraries_library_shift_gap_analysis/types/SuperadminLibrariesOverviewLibraryShiftGapAnalysisShiftGapTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Accounting Shift Gap Types; defines module-owned type contracts for the named data boundary. */
export interface SuperadminAccountingShiftGapSummary {
  shift: string; totalSeats: number; occupied: number; vacant: number; occupancyPct: number; avgGapDays: number; revenueLoss: number;
}

/**
 * Defines the public SuperadminAccountingShiftGapDay contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property date Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property shift Value defined by the existing feature-local contract. Declared type: string.
 * @property seatNo Value defined by the existing feature-local contract. Declared type: string.
 * @property gapDays Value defined by the existing feature-local contract. Declared type: number.
 * @property loss Value defined by the existing feature-local contract. Declared type: number.
 */
export interface SuperadminAccountingShiftGapDay { date: string; shift: string; seatNo: string; gapDays: number; loss: number; }
