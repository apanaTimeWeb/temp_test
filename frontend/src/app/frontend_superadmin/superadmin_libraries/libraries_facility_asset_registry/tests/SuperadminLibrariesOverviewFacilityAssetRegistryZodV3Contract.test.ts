// RESPONSIBILITY: Protect the asset form schema's mandated Zod v3 error contract.
import { describe, expect, it } from 'vitest';
import { SuperadminAccountingAssetSchema } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/schemas/SuperadminLibrariesOverviewFacilityAssetRegistryAssetSchema';

describe('facility asset registry Zod v3 schema contract', () => {
  it('preserves localized enum errors for unsupported categories', () => {
    const result = SuperadminAccountingAssetSchema.safeParse({ name: 'Sample', category: 'Unsupported', purchaseDate: '2026-04-02', purchaseValue: '100', location: 'Sample location' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.find((issue) => issue.path[0] === 'category')?.message).toBe('SUPERADMIN_ACCOUNTING.VALIDATION.SELECT_A_VALID_OPTION');
  });

  it('preserves the localized object-level invalid-type message', () => {
    const result = SuperadminAccountingAssetSchema.safeParse(null);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toBe('SUPERADMIN_ACCOUNTING.VALIDATION.PROVIDE_VALID_FORM_DATA');
  });
});
