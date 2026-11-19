// RESPONSIBILITY: Define source-level test coverage for settings maintenance mode using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_maintenance_mode/tests/SuperadminSettingsMaintenanceModeActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS = resolve(__dirname, '../components');

describe('settings_maintenance_mode active-route branch contract', () => {
  it('renders only its active route branch locally', () => {
    const page = readFileSync(resolve(COMPONENTS, 'SuperadminSettingsMaintenanceModePageClient.tsx'), 'utf8');
    expect(page).toContain('Maintenance Mode');
    for (const sibling of ['General', 'APIs & Integrations']) expect(page).not.toContain(`activeTab === '${sibling}'`);
  });
});
