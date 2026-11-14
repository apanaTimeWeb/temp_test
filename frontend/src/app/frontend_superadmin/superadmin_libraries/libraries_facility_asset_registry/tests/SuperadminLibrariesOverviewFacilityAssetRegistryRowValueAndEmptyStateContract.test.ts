// RESPONSIBILITY: Protect row-specific asset financial values and collection-vs-filter empty-state semantics.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const pageClient = readFileSync(resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient.tsx'), 'utf8');

describe('facility asset registry row and empty-state contract', () => {
  it('renders each row purchase and current value through the locale-aware formatter', () => {
    expect(pageClient).toContain("formatSuperadminAccountingMajorPreviewCurrency(a.purchaseValue, 'INR', locale)");
    expect(pageClient).toContain("formatSuperadminAccountingMajorPreviewCurrency(a.currentValue, 'INR', locale)");
    expect(pageClient).not.toContain("tCopy('COPY.FINANCIAL_DETAIL_ONLY')");
  });

  it('labels an empty collection differently from an active category filter', () => {
    expect(pageClient).toContain("filtered={catFilter !== 'all'}");
  });
});
