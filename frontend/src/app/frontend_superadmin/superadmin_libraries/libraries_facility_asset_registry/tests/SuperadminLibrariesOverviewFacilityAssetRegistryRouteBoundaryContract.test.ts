// RESPONSIBILITY: Define source-level test coverage for libraries facility asset registry using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_facility_asset_registry/tests/SuperadminLibrariesOverviewFacilityAssetRegistryRouteBoundaryContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MODULE_ROOT = resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry');
const COMPONENTS = resolve(MODULE_ROOT, 'components');

describe('superadmin_libraries/libraries_facility_asset_registry route boundary contract', () => {
  it('wires accessible loading and retryable error boundaries', () => {
    const loading = readFileSync(resolve(MODULE_ROOT, 'loading.tsx'), 'utf8');
    const error = readFileSync(resolve(MODULE_ROOT, 'error.tsx'), 'utf8');
    const skeleton = readFileSync(resolve(COMPONENTS, 'SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx'), 'utf8');
    const fallback = readFileSync(resolve(COMPONENTS, 'SuperadminLibrariesOverviewFacilityAssetRegistryErrorFallback.tsx'), 'utf8');
    expect(loading).toContain('SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton');
    expect(error).toContain('SuperadminLibrariesOverviewFacilityAssetRegistryErrorFallback');
    expect(skeleton).toContain('role="status"');
    expect(skeleton).toContain('aria-busy="true"');
    expect(skeleton).toContain('motion-reduce:animate-none');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('onClick={onRetry}');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
  });

  it('has localized not-found recovery in both supported locales', () => {
    const notFound = readFileSync(resolve(MODULE_ROOT, 'not-found.tsx'), 'utf8');
    const en = JSON.parse(readFileSync(resolve(MODULE_ROOT, 'locales/superadmin_libraries_overview_facility_asset_registry_en.json'), 'utf8'));
    const hi = JSON.parse(readFileSync(resolve(MODULE_ROOT, 'locales/superadmin_libraries_overview_facility_asset_registry_hi.json'), 'utf8'));
    expect(notFound).toContain('COPY.MODULE_NOT_FOUND_TITLE');
    const routeConfig = readFileSync(resolve(MODULE_ROOT, 'config/libraries_facility_asset_registry.url_config.ts'), 'utf8');
    expect(notFound).toContain('href={SUPERADMIN_LIBRARIES_FACILITY_ASSET_REGISTRY_ROUTES.DASHBOARD_RECOVERY}');
    expect(notFound).not.toContain('/superadmin/superadmin_dashboard/dashboard_overview');
    expect(routeConfig).toContain("DASHBOARD_RECOVERY: SUPERADMIN_DASHBOARD_OVERVIEW_RECOVERY_URL");
    expect(routeConfig).toContain("'/superadmin/superadmin_dashboard/dashboard_overview'");
    for (const locale of [en, hi]) {
      expect(locale['SUPERADMIN_ACCOUNTING'].COPY.MODULE_NOT_FOUND_TITLE).toBeTruthy();
      expect(locale['SUPERADMIN_ACCOUNTING'].COPY.MODULE_NOT_FOUND_MESSAGE).toBeTruthy();
      expect(locale['SUPERADMIN_ACCOUNTING'].COPY.BACK_TO_DASHBOARD).toBeTruthy();
    }
  });
});
