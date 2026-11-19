// RESPONSIBILITY: Define source-level test coverage for security password policy using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_password_policy/tests/SuperadminSecurityPasswordPolicyActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const componentsDir = resolve(here, '../components');

describe('security_password_policy active-route branch contract', () => {
  it('keeps the active route view and excludes sibling-only local branches', () => {
    const page = readFileSync(resolve(componentsDir, 'SuperadminSecurityPasswordPolicyPageClient.tsx'), 'utf8');
    const panel = readFileSync(resolve(componentsDir, 'SuperadminSecurityPasswordPolicyPolicyPanels.tsx'), 'utf8');
    expect(page).toContain('Password Policy');
    expect(panel).toContain('Password Policy');
    for (const sibling of ['API Keys', 'Active Sessions', 'Audit & Threats', 'IP Firewall']) expect(panel).not.toContain(`activeTab === '${sibling}'`);
  });
});
