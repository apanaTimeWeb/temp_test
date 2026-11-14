// RESPONSIBILITY: Define source-level test coverage for security password policy using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_password_policy/tests/SuperadminSecurityPasswordPolicyActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const COMPONENTS = new URL('../components/', import.meta.url);

describe('security_password_policy active-route branch contract', () => {
  it('keeps the active route view and excludes sibling-only local branches', () => {
    const page = readFileSync(new URL('SuperadminSecurityPasswordPolicyPageClient.tsx', COMPONENTS), 'utf8');
    const panel = readFileSync(new URL('SuperadminSecurityPasswordPolicyPolicyPanels.tsx', COMPONENTS), 'utf8');
    expect(page).toContain('Password Policy');
    expect(panel).toContain('Password Policy');
    for (const sibling of ['API Keys', 'Active Sessions', 'Audit & Threats', 'IP Firewall']) expect(panel).not.toContain(`activeTab === '${sibling}'`);
  });
});
