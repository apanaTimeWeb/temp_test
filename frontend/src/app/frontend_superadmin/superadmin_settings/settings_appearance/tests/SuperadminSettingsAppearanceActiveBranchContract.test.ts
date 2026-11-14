// RESPONSIBILITY: Define source-level test coverage for settings appearance using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_appearance/tests/SuperadminSettingsAppearanceActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const COMPONENTS = new URL('../components/', import.meta.url);

describe('settings_appearance active-route branch contract', () => {
  it('renders only its active route branch locally', () => {
    const page = readFileSync(new URL('SuperadminSettingsAppearancePageClient.tsx', COMPONENTS), 'utf8');
    expect(page).toContain('Appearance');
    for (const sibling of ['General', 'APIs & Integrations', 'Maintenance Mode']) expect(page).not.toContain(`activeTab === '${sibling}'`);
  });
});
