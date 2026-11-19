// RESPONSIBILITY: Verify that the independently routed API Keys leaf contains only its own active workflow contract.
// FLOW: Test runner -> source contracts and fixtures -> API Keys-only branch assertions; runtime execution remains host-dependent.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LEAF = resolve(__dirname, '..');
const COMPONENTS = resolve(__dirname, '../components');

describe('security_api_keys active-route branch contract', () => {
  it('retains API Keys navigation and excludes unreachable sibling form state and handlers', () => {
    const page = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityApiKeysPageClient.tsx'), 'utf8');
    const panel = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityApiKeysOperationsPanels.tsx'), 'utf8');
    expect(page).toContain("const activeTab = 'API Keys'");
    expect(page).toContain('SUPERADMIN_SECURITY_TABS.map');
    expect(page).toContain('SuperadminSecurityApiKeysOperationsPanels apiKeys={SUPERADMIN_SECURITY_API_KEYS}');
    for (const deadContract of ['loginForm', 'passwordForm', 'SUPERADMIN_SECURITY_LOGIN_SCHEMA', 'SUPERADMIN_SECURITY_PASSWORD_SCHEMA', 'SUPERADMIN_SECURITY_MFA_PREVIEW', 'SUPERADMIN_SECURITY_FAILED_LOGINS', 'SUPERADMIN_SECURITY_SESSIONS', 'SUPERADMIN_SECURITY_IP_RULES', 'handleAddIp', 'handleForceLogout', 'handleExportLogs']) {
      expect(page).not.toContain(deadContract);
    }
    for (const deadProp of ['activeTab', 'newIp', 'ipRules', 'sessions', 'failedLogins', 'handleAddIp', 'handleForceLogout', 'handleExportLogs']) {
      expect(panel).not.toContain(deadProp);
    }
    expect(panel).toContain('apiKeys.map');
  });

  it('removes API Keys leaf copies of sibling Login Security and Password Policy contracts', () => {
    expect(existsSync(resolve(LEAF, 'schemas/SuperadminSecurityApiKeysPolicySchema.ts'))).toBe(false);
    expect(existsSync(resolve(LEAF, 'types/SuperadminSecurityApiKeysTypes.ts'))).toBe(false);
    expect(existsSync(resolve(LEAF, 'constants/SuperadminSecurityApiKeysStaticConstants.ts'))).toBe(false);
  });

  it('keeps only redacted API-key sample records in this leaf fixture', () => {
    const fixtures = readFileSync(resolve(LEAF, 'mocks/fixtures/SuperadminSecurityApiKeysPreviewMockFixtures.ts'), 'utf8');
    expect(fixtures).toContain('SUPERADMIN_SECURITY_API_KEYS');
    for (const siblingFixture of ['SUPERADMIN_SECURITY_IP_RULES', 'SUPERADMIN_SECURITY_SESSIONS', 'SUPERADMIN_SECURITY_FAILED_LOGINS', 'SUPERADMIN_SECURITY_MFA_PREVIEW', 'SUPERADMIN_SECURITY_LOGIN_PREVIEW_DEFAULTS', 'SUPERADMIN_SECURITY_PASSWORD_PREVIEW_DEFAULTS']) {
      expect(fixtures).not.toContain(siblingFixture);
    }
  });
});
