// RESPONSIBILITY: Define source-level test coverage for security ip firewall using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_ip_firewall/tests/SuperadminSecurityIpFirewallActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const COMPONENTS = new URL('../components/', import.meta.url);

describe('security_ip_firewall active-route branch contract', () => {
  it('keeps the active route view and excludes sibling-only local branches', () => {
    const page = readFileSync(new URL('SuperadminSecurityIpFirewallPageClient.tsx', COMPONENTS), 'utf8');
    const panel = readFileSync(new URL('SuperadminSecurityIpFirewallOperationsPanels.tsx', COMPONENTS), 'utf8');
    expect(page).toContain('IP Firewall');
    expect(panel).toContain('IP Firewall');
    for (const sibling of ['Login Security', 'Password Policy', '2FA & MFA']) expect(panel).not.toContain(`activeTab === '${sibling}'`);
  });
});
