// RESPONSIBILITY: Define source-level test coverage for settings storage using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_storage/tests/RBG25_ActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('RBG-25 active route branch contract', () => {
  it('preserves the active route and excludes unreachable sibling render branches', () => {
    const source = readFileSync(new URL('../components/SuperadminSettingsStoragePageClient.tsx', import.meta.url), 'utf8');
    expect(source).toContain("activeTab");
    expect(source).not.toContain("activeTab === 'General' &&");
    expect(source).not.toContain("activeTab === 'APIs & Integrations' &&");
    expect(source).not.toContain("activeTab === 'Maintenance Mode' &&");
  });
});
