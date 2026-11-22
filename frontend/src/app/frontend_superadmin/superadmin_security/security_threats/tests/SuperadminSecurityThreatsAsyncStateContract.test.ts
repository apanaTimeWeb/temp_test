// RESPONSIBILITY: Define source-level test coverage for security threats using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_threats/tests/SuperadminSecurityThreatsAsyncStateContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS = resolve(__dirname, '../components');

describe('security_threats async-state contract', () => {
  it('uses an accessible reduced-motion-safe loading skeleton', () => {
    const source = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityThreatsListSkeleton.tsx'), 'utf8');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('key={key}');
  });
  it('provides safe localized error recovery and wires route boundaries', () => {
    const fallback = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityThreatsErrorFallback.tsx'), 'utf8');
    const loading = readFileSync(resolve(__dirname, '../loading.tsx'), 'utf8');
    const error = readFileSync(resolve(__dirname, '../error.tsx'), 'utf8');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
    expect(loading).toContain('SuperadminSecurityThreatsListSkeleton');
    expect(error).toContain('SuperadminSecurityThreatsErrorFallback');
    expect(error).not.toContain('...props');
  });
  it('keeps sibling security workflows route-separated from this Audit & Threats leaf', () => {
    const pageClient = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityThreatsPageClient.tsx'), 'utf8');
    const operations = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityThreatsOperationsPanels.tsx'), 'utf8');
    expect(pageClient).toContain("const activeTab = 'Audit & Threats'");
    expect(pageClient).not.toContain('onClick={() => navigateToWorkflow(tab.name)}');
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
