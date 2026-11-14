// RESPONSIBILITY: Define source-level test coverage for libraries onboarding setup using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_onboarding_setup/tests/SuperadminLibrariesOnboardingSetupCanonicalWorkflowRouteContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES as __SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES } from "../config/superadmin_libraries_onboarding_setup.url_config";
import { readFileSync } from 'node:fs';

const EXPECTED_WORKFLOW_VIEWS = ["student_bulk_import", "student_smart_id"] as const;
const CANONICAL_OWNER_ROUTE = '/superadmin/superadmin_libraries/libraries_onboarding_setup';

describe('superadmin_libraries/libraries_onboarding_setup canonical workflow route contract', () => {
  it('keeps each migrated workflow inside the canonical leaf URL', () => {
    const routes = Object.values(__SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_ROUTES.SUPERADMIN_LIBRARIES_ONBOARDING_SETUP_WORKFLOW_URLS);
    expect(routes).toHaveLength(EXPECTED_WORKFLOW_VIEWS.length);
    for (const route of routes) {
      expect(route.startsWith(`${CANONICAL_OWNER_ROUTE}?view=`)).toBe(true);
      expect(route.match(/\?view=/g)).toHaveLength(1);
    }
  });

  it('dispatches every declared workflow view from the canonical page', () => {
    const source = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8');
    for (const view of EXPECTED_WORKFLOW_VIEWS) {
      expect(source).toMatch(new RegExp(`view === [\"']${view}[\"']`));
    }
  });
  it('resolves migrated workflows from the owning URL config rather than hardcoded destinations', () => {
    const source = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8');
    expect(source).toContain('LEGACY_DESTINATIONS.STUDENT_BULK_IMPORT');
    expect(source).toContain('LEGACY_DESTINATIONS.STUDENT_SMART_ID');
    expect(source).not.toContain('redirect("/superadmin/superadmin_libraries/libraries_student_');
  });

});
