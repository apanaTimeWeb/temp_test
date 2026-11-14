// RESPONSIBILITY: Provide deterministic module-owned helper behavior for libraries facility asset registry; it does not own page routing or live backend persistence.
// FLOW: Feature caller -> superadmin_libraries/libraries_facility_asset_registry/utils/SuperadminLibrariesOverviewFacilityAssetRegistryAssetUtilities.ts -> typed input/contract -> deterministic helper result.
import type { SuperadminAccountingAsset } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/types/SuperadminLibrariesOverviewFacilityAssetRegistryAssetTypes';

/** Derive selectable categories from current rows, including locally added preview assets. 
 * @param assets - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function getSuperadminAccountingAssetCategories(assets: readonly SuperadminAccountingAsset[]): string[] {
  return [...new Set(assets.map((asset) => asset.category))].sort((left, right) => left.localeCompare(right));
}
