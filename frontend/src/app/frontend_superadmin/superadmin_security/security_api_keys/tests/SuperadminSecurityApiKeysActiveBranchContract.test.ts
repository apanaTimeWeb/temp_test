// RESPONSIBILITY: Verify that the independently routed API Keys leaf contains only its own active workflow contract.
// FLOW: Test runner -> source contracts and fixtures -> API Keys-only branch assertions; runtime execution remains host-dependent.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const LEAF = new URL('../', import.meta.url);
const COMPONENTS = new URL('../components/', import.meta.url);

describe('security_api_keys active-route branch contract', () => {
  it('retains API Keys navigation and excludes unreachable sibling form state and handlers', () => {
    const page = readFileSync(new URL('SuperadminSecurityApiKeysPageClient.tsx', COMPONENTS), 'utf8');
    const panel = readFileSync(new URL('SuperadminSecurityApiKeysOperationsPanels.tsx', COMPONENTS), 'utf8');
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
    expect(existsSync(new URL('schemas/SuperadminSecurityApiKeysPolicySchema.ts', LEAF))).toBe(false);
    expect(existsSync(new URL('types/SuperadminSecurityApiKeysTypes.ts', LEAF))).toBe(false);
    expect(existsSync(new URL('constants/SuperadminSecurityApiKeysStaticConstants.ts', LEAF))).toBe(false);
  });

  it('keeps only redacted API-key sample records in this leaf fixture', () => {
    const fixtures = readFileSync(new URL('mocks/fixtures/SuperadminSecurityApiKeysPreviewMockFixtures.ts', LEAF), 'utf8');
    expect(fixtures).toContain('SUPERADMIN_SECURITY_API_KEYS');
    for (const siblingFixture of ['SUPERADMIN_SECURITY_IP_RULES', 'SUPERADMIN_SECURITY_SESSIONS', 'SUPERADMIN_SECURITY_FAILED_LOGINS', 'SUPERADMIN_SECURITY_MFA_PREVIEW', 'SUPERADMIN_SECURITY_LOGIN_PREVIEW_DEFAULTS', 'SUPERADMIN_SECURITY_PASSWORD_PREVIEW_DEFAULTS']) {
      expect(fixtures).not.toContain(siblingFixture);
    }
  });
});
