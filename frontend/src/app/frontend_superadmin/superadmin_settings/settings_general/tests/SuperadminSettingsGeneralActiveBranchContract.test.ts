// RESPONSIBILITY: Define source-level test coverage for settings general using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_general/tests/SuperadminSettingsGeneralActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS = resolve(__dirname, '../components');

describe('settings_general active-route branch contract', () => {
  it('renders only its active route branch locally', () => {
    const page = readFileSync(resolve(COMPONENTS, 'SuperadminSettingsGeneralPageClient.tsx'), 'utf8');
    expect(page).toContain('General');
    for (const sibling of ['APIs & Integrations', 'Maintenance Mode']) expect(page).not.toContain(`activeTab === '${sibling}'`);
  });
});
