// RESPONSIBILITY: Define source-level test coverage for security threats using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_threats/tests/SuperadminSecurityThreatsAsyncStateContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const COMPONENTS = new URL('../components/', import.meta.url);

describe('security_threats async-state contract', () => {
  it('uses an accessible reduced-motion-safe loading skeleton', () => {
    const source = readFileSync(new URL('SuperadminSecurityThreatsListSkeleton.tsx', COMPONENTS), 'utf8');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('key={key}');
  });
  it('provides safe localized error recovery and wires route boundaries', () => {
    const fallback = readFileSync(new URL('SuperadminSecurityThreatsErrorFallback.tsx', COMPONENTS), 'utf8');
    const loading = readFileSync(new URL('../loading.tsx', import.meta.url), 'utf8');
    const error = readFileSync(new URL('../error.tsx', import.meta.url), 'utf8');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
    expect(loading).toContain('SuperadminSecurityThreatsListSkeleton');
    expect(error).toContain('SuperadminSecurityThreatsErrorFallback');
    expect(error).not.toContain('...props');
  });
  it('keeps sibling security workflows route-separated from this Audit & Threats leaf', () => {
    const pageClient = readFileSync(new URL('SuperadminSecurityThreatsPageClient.tsx', COMPONENTS), 'utf8');
    const operations = readFileSync(new URL('SuperadminSecurityThreatsOperationsPanels.tsx', COMPONENTS), 'utf8');
    expect(pageClient).toContain("const activeTab = 'Audit & Threats'");
    expect(pageClient).toContain('onClick={() => navigateToWorkflow(tab.name)}');
    expect(pageClient).toContain('SUPERADMIN_NAVIGATION_ROUTES.security_login_security');
    expect(pageClient).toContain('SUPERADMIN_NAVIGATION_ROUTES.security_password_policy');
    expect(pageClient).not.toContain('SuperadminSecurityThreatsPolicyPanels');
    expect(pageClient).not.toContain('SUPERADMIN_SECURITY_LOGIN_SCHEMA');
    expect(operations).toContain('failedLogins.map');
    expect(operations).toContain('onClick={handleExportLogs}');
    expect(operations).not.toContain("activeTab === 'IP Firewall'");
    expect(operations).not.toContain("activeTab === 'API Keys'");
    expect(operations).not.toContain("activeTab === 'Active Sessions'");
    expect(operations).not.toContain('SuperadminSecurityThreatsPolicyPanels');
  });

});
