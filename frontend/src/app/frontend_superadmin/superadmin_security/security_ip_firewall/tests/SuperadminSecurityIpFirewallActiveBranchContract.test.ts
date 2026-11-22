// RESPONSIBILITY: Define source-level test coverage for security ip firewall using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_ip_firewall/tests/SuperadminSecurityIpFirewallActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS = resolve(__dirname, '../components');

describe('security_ip_firewall active-route branch contract', () => {
  it('keeps the active route view and excludes sibling-only local branches', () => {
    const page = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityIpFirewallPageClient.tsx'), 'utf8');
    const panel = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityIpFirewallOperationsPanels.tsx'), 'utf8');
    expect(page).toContain('IP Firewall');
    expect(panel).toContain('IP Firewall');
    for (const sibling of ['Login Security', 'Password Policy', '2FA & MFA']) expect(panel).not.toContain(`activeTab === '${sibling}'`);
  });
});
