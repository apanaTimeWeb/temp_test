// RESPONSIBILITY: Define source-level test coverage for settings general using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_general/tests/SuperadminSettingsGeneralCanonicalWorkflowRouteContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SETTINGS_GENERAL_ROUTES as __SUPERADMIN_SETTINGS_GENERAL_ROUTES } from "../config/superadmin_settings_general.url_config";
import { readFileSync } from 'node:fs';

const EXPECTED_WORKFLOW_VIEWS = ["settings_library_configuration"] as const;
const CANONICAL_OWNER_ROUTE = '/superadmin/superadmin_settings/settings_general';

describe('superadmin_settings/settings_general canonical workflow route contract', () => {
  it('keeps each migrated workflow inside the canonical leaf URL', () => {
    const routes = Object.values(__SUPERADMIN_SETTINGS_GENERAL_ROUTES.SUPERADMIN_SETTINGS_GENERAL_WORKFLOW_URLS);
    expect(routes).toHaveLength(EXPECTED_WORKFLOW_VIEWS.length);
    for (const route of routes) {
      expect(route.startsWith(`${CANONICAL_OWNER_ROUTE}?view=`)).toBe(true);
      expect(route.match(/\?view=/g)).toHaveLength(1);
    }
  });

  it('dispatches every declared workflow view from the canonical page', () => {
    const source = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8');
    for (const view of EXPECTED_WORKFLOW_VIEWS) {
      expect(source).toMatch(new RegExp(`view\\s*===\\s*['\"]${view}['\"]`));
    }
  });
});
