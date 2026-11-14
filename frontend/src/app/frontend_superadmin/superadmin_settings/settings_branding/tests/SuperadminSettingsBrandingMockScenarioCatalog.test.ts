// RESPONSIBILITY: Define source-level test coverage for settings branding using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_branding/tests/SuperadminSettingsBrandingMockScenarioCatalog.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_CANONICAL_MOCK_SCENARIOS } from '../mocks/scenarios/superadmin_settings_branding.scenarios';
import { SUPERADMIN_SYSTEM_BRANDING_PAGE_CLIENT_BRANDING_DEFAULTS } from '../constants/SuperadminSettingsBrandingStaticConstants';

describe('settings_branding canonical mock scenario catalog', () => {
  it('declares all mandatory scenario keys without inventing backend contracts', () => {
    expect(SUPERADMIN_CANONICAL_MOCK_SCENARIOS.map((scenario) => scenario.key)).toEqual([
      'ACTIVE_RECORDS', 'EMPTY_DATA', 'SERVER_500_ERROR', 'NETWORK_TIMEOUT', 'UNAUTHORIZED_401', 'FORBIDDEN_403',
    ]);
  });
});

describe('settings_branding rendered form coverage', () => {
  it('aligns visible branding fields with schema and uses the local preview defaults', () => {
    const page = readFileSync(new URL('../components/SuperadminSettingsBrandingPageClient.tsx', import.meta.url), 'utf8');
    const schema = readFileSync(new URL('../schemas/SuperadminSettingsBrandingSchema.ts', import.meta.url), 'utf8');
    for (const field of ['libraryName', 'tagline', 'primaryColor', 'accentColor']) {
      expect(page).toContain(field);
      expect(schema).toContain(field);
    }
    expect(SUPERADMIN_SYSTEM_BRANDING_PAGE_CLIENT_BRANDING_DEFAULTS).toMatchObject({
      libraryName: 'Library OS',
      tagline: 'Your Knowledge Hub',
    });
    expect(page).toContain('PRIMARY_COLOR_PICKER');
    expect(page).toContain('ACCENT_COLOR_PICKER');
  });
});

describe('settings_branding eight-state traceability', () => {
  it('keeps non-runnable network and mutation states documented without expanding the runnable registry', () => {
    const featureDoc = readFileSync(new URL('../superadmin_settings_branding_features.md', import.meta.url), 'utf8');
    for (const state of ['ACTIVE', 'EMPTY', 'SERVER_500', 'TIMEOUT', 'UNAUTHORIZED', 'LOADING', 'MUTATION_FAILURE', 'UNAVAILABLE_MUTATION']) {
      expect(featureDoc).toContain(`\`${state}\``);
    }
    expect(SUPERADMIN_CANONICAL_MOCK_SCENARIOS).toHaveLength(6);
  });
});
