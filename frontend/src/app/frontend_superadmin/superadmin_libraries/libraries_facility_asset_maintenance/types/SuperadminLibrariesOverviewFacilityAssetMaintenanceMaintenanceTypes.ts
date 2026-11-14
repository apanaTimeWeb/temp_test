// FLOW: Feature source -> superadmin_libraries/libraries_facility_asset_maintenance/types/SuperadminLibrariesOverviewFacilityAssetMaintenanceMaintenanceTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Accounting Maintenance Types; defines module-owned type contracts for the named data boundary. */
export type SuperadminAccountingMaintenanceStatus = 'pending' | 'in-progress' | 'completed';

/**
 * Defines the public SuperadminAccountingMaintenanceLog contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: number.
 * @property assetName Display label for the owning feature. Declared type: string.
 * @property issue Boolean state used by the owning feature. Declared type: string.
 * @property reportedDate Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property scheduledDate Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property vendor Value defined by the existing feature-local contract. Declared type: string.
 * @property cost Value defined by the existing feature-local contract. Declared type: number.
 * @property status Status value as represented by the existing feature contract. Declared type: SuperadminAccountingMaintenanceStatus.
 */
export interface SuperadminAccountingMaintenanceLog {
  id: number; assetName: string; issue: string; reportedDate: string; scheduledDate: string; vendor: string; cost: number; status: SuperadminAccountingMaintenanceStatus;
}
