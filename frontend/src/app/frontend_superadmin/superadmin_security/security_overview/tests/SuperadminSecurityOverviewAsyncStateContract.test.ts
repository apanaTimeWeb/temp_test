// RESPONSIBILITY: Define source-level test coverage for security overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_overview/tests/SuperadminSecurityOverviewAsyncStateContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS = resolve(__dirname, '../components');

describe('security_overview async-state contract', () => {
  it('uses an accessible reduced-motion-safe loading skeleton', () => {
    const source = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityOverviewListSkeleton.tsx'), 'utf8');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('key={key}');
  });
  it('documents only the live read-only overview data sources', () => {
    const page = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityOverviewPageClient.tsx'), 'utf8');
    const feature = readFileSync(resolve(__dirname, '../superadmin_security_overview_features.md'), 'utf8');
    expect(page).toContain('SUPERADMIN_SECURITY_FAILED_LOGINS');
    expect(page).toContain('SUPERADMIN_SECURITY_SESSIONS');
    expect(page).not.toContain('SUPERADMIN_SECURITY_API_KEYS');
    expect(page).toContain('SUPERADMIN_SECURITY_IP_RULES');
    expect(page).toContain('SuperadminSecurityOverviewThreatEventsTable');
    expect(feature).toContain('read-only security-center overview');
  });

  it('provides safe localized error recovery and wires route boundaries', () => {
    const fallback = readFileSync(resolve(COMPONENTS, 'SuperadminSecurityOverviewErrorFallback.tsx'), 'utf8');
    const loading = readFileSync(resolve(__dirname, '../loading.tsx'), 'utf8');
    const error = readFileSync(resolve(__dirname, '../error.tsx'), 'utf8');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
    expect(loading).toContain('SuperadminSecurityOverviewListSkeleton');
    expect(error).toContain('SuperadminSecurityOverviewErrorFallback');
    expect(error).not.toContain('...props');
  });
});
