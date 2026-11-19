// RESPONSIBILITY: Define source-level test coverage for security mfa using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_mfa/tests/SuperadminSecurityMfaActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS = resolve(__dirname, '../components');

describe('security_mfa active-route branch contract', () => {
  it('keeps the active route view and excludes sibling-only local branches', () => {
    const page = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityMfaPageClient.tsx'), 'utf8');
    const panel = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityMfaPolicyPanels.tsx'), 'utf8');
    expect(page).toContain('2FA & MFA');
    expect(panel).toContain('2FA & MFA');
    for (const sibling of ['API Keys', 'Active Sessions', 'Audit & Threats', 'IP Firewall']) expect(panel).not.toContain(`activeTab === '${sibling}'`);
  });
});
