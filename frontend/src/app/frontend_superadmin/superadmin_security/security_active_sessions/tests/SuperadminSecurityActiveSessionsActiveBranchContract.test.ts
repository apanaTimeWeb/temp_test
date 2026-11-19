// RESPONSIBILITY: Define source-level test coverage for security active sessions using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_active_sessions/tests/SuperadminSecurityActiveSessionsActiveBranchContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS = resolve(__dirname, '../components');

describe('security_active_sessions active-route branch contract', () => {
  it('keeps the active route view and excludes sibling-only local branches', () => {
    const page = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityActiveSessionsPageClient.tsx'), 'utf8');
    const panel = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityActiveSessionsOperationsPanels.tsx'), 'utf8');
    expect(page).toContain('Active Sessions');
    expect(panel).toContain('Active Sessions');
    for (const sibling of ['Login Security', 'Password Policy', '2FA & MFA']) expect(panel).not.toContain(`activeTab === '${sibling}'`);
  });
});
