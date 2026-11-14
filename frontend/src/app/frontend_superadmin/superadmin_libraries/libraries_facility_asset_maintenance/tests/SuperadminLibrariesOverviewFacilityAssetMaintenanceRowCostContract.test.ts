// RESPONSIBILITY: Protect row-specific maintenance-cost presentation using the existing leaf currency formatter.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const pageClient = readFileSync(resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/components/SuperadminLibrariesOverviewFacilityAssetMaintenancePageClient.tsx'), 'utf8');

describe('facility asset maintenance row cost contract', () => {
  it('renders each row cost through the locale-aware INR preview formatter', () => {
    expect(pageClient).toContain("formatSuperadminAccountingMajorPreviewCurrency(l.cost, 'INR', locale)");
    expect(pageClient).not.toContain("tCopy('COPY.FINANCIAL_DETAIL_ONLY')");
  });
});
