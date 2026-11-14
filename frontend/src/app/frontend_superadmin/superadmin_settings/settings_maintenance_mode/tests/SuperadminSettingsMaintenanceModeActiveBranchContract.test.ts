// RESPONSIBILITY: Define source-level test coverage for settings maintenance mode using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_maintenance_mode/tests/SuperadminSettingsMaintenanceModeActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const COMPONENTS = new URL('../components/', import.meta.url);

describe('settings_maintenance_mode active-route branch contract', () => {
  it('renders only its active route branch locally', () => {
    const page = readFileSync(new URL('SuperadminSettingsMaintenanceModePageClient.tsx', COMPONENTS), 'utf8');
    expect(page).toContain('Maintenance Mode');
    for (const sibling of ['General', 'APIs & Integrations']) expect(page).not.toContain(`activeTab === '${sibling}'`);
  });
});
