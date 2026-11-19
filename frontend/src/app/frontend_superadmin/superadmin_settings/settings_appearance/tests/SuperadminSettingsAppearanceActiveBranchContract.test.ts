// RESPONSIBILITY: Define source-level test coverage for settings appearance using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_appearance/tests/SuperadminSettingsAppearanceActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS = resolve(__dirname, '../components');

describe('settings_appearance active-route branch contract', () => {
  it('renders only its active route branch locally', () => {
    const page = readFileSync(resolve(COMPONENTS, 'SuperadminSettingsAppearancePageClient.tsx'), 'utf8');
    expect(page).toContain('Appearance');
    for (const sibling of ['General', 'APIs & Integrations', 'Maintenance Mode']) expect(page).not.toContain(`activeTab === '${sibling}'`);
  });
});
