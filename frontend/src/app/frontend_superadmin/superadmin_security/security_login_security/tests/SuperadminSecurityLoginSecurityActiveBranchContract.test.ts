// RESPONSIBILITY: Define source-level test coverage for security login security using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_login_security/tests/SuperadminSecurityLoginSecurityActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS = resolve(__dirname, '../components');

describe('security_login_security active-route branch contract', () => {
  it('keeps the active route view and excludes sibling-only local branches', () => {
    const page = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityLoginSecurityPageClient.tsx'), 'utf8');
    const panel = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityLoginSecurityPolicyPanels.tsx'), 'utf8');
    expect(page).toContain('Login Security');
    expect(panel).toContain('Login Security');
    for (const sibling of ['API Keys', 'Active Sessions', 'Audit & Threats', 'IP Firewall']) expect(panel).not.toContain(`activeTab === '${sibling}'`);
  });
});
