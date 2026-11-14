// FLOW: Feature source -> superadmin_libraries/libraries_facility_asset_registry/types/SuperadminLibrariesOverviewFacilityAssetRegistryAssetTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Accounting Asset Types; defines module-owned type contracts for the named data boundary. */
export type SuperadminAccountingAssetStatus = 'active' | 'maintenance' | 'disposed';

/**
 * Defines the public SuperadminAccountingAsset contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: number.
 * @property name Display label for the owning feature. Declared type: string.
 * @property category Value defined by the existing feature-local contract. Declared type: string.
 * @property purchaseDate Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property purchaseValue Value defined by the existing feature-local contract. Declared type: number.
 * @property currentValue Value defined by the existing feature-local contract. Declared type: number.
 * @property location Value defined by the existing feature-local contract. Declared type: string.
 * @property status Status value as represented by the existing feature contract. Declared type: SuperadminAccountingAssetStatus.
 */
export interface SuperadminAccountingAsset {
  id: number; name: string; category: string; purchaseDate: string; purchaseValue: number; currentValue: number; location: string; status: SuperadminAccountingAssetStatus;
}
