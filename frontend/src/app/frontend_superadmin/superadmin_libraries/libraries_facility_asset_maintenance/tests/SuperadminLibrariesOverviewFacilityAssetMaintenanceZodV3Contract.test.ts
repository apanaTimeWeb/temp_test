// RESPONSIBILITY: Protect the maintenance form schema's mandated Zod v3 error contract.
import { describe, expect, it } from 'vitest';
import { SuperadminAccountingMaintenanceSchema } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/schemas/SuperadminLibrariesOverviewFacilityAssetMaintenanceMaintenanceSchema';

describe('facility asset maintenance Zod v3 schema contract', () => {
  it('preserves localized required and invalid-type messages for strings', () => {
    const result = SuperadminAccountingMaintenanceSchema.safeParse({
      issue: 'Sample issue', reportedDate: '2026-04-02', scheduledDate: '2026-04-08', vendor: '', cost: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.find((issue) => issue.path[0] === 'assetName')?.message).toBe('SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE');
  });

  it('preserves the localized object-level invalid-type message', () => {
    const result = SuperadminAccountingMaintenanceSchema.safeParse(null);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toBe('SUPERADMIN_ACCOUNTING.VALIDATION.PROVIDE_VALID_FORM_DATA');
  });
});
