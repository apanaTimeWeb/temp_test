// FLOW: Feature source -> superadmin_libraries/libraries_library_capacity_analysis/types/SuperadminLibrariesOverviewLibraryCapacityAnalysisSeatGapTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Accounting Seat Gap Types; defines module-owned type contracts for the named data boundary. */
export type SuperadminAccountingSeatGapStatus = 'vacant' | 'maintenance';

/**
 * Defines the public SuperadminAccountingSeatGapRow contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property seatNo Value defined by the existing feature-local contract. Declared type: string.
 * @property shift Value defined by the existing feature-local contract. Declared type: string.
 * @property floor Value defined by the existing feature-local contract. Declared type: string.
 * @property lastOccupied Value defined by the existing feature-local contract. Declared type: string.
 * @property gapDays Value defined by the existing feature-local contract. Declared type: number.
 * @property revenueLoss Value defined by the existing feature-local contract. Declared type: number.
 * @property status Status value as represented by the existing feature contract. Declared type: SuperadminAccountingSeatGapStatus.
 */
export interface SuperadminAccountingSeatGapRow {
  seatNo: string; shift: string; floor: string; lastOccupied: string; gapDays: number; revenueLoss: number; status: SuperadminAccountingSeatGapStatus;
}
