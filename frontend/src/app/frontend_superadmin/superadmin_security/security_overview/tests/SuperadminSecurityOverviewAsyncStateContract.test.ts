// RESPONSIBILITY: Define source-level test coverage for security overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_overview/tests/SuperadminSecurityOverviewAsyncStateContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const COMPONENTS = new URL('../components/', import.meta.url);

describe('security_overview async-state contract', () => {
  it('uses an accessible reduced-motion-safe loading skeleton', () => {
    const source = readFileSync(new URL('SuperadminSecurityOverviewListSkeleton.tsx', COMPONENTS), 'utf8');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('key={key}');
  });
  it('documents only the live read-only overview data sources', () => {
    const page = readFileSync(new URL('SuperadminSecurityOverviewPageClient.tsx', COMPONENTS), 'utf8');
    const feature = readFileSync(new URL('../superadmin_security_overview_features.md', import.meta.url), 'utf8');
    expect(page).toContain('SUPERADMIN_SECURITY_FAILED_LOGINS');
    expect(page).toContain('SUPERADMIN_SECURITY_SESSIONS');
    expect(page).toContain('SUPERADMIN_SECURITY_API_KEYS');
    expect(page).toContain('SUPERADMIN_SECURITY_IP_RULES');
    expect(page).toContain('SUPERADMIN_SECURITY_TABS');
    expect(feature).toContain('read-only security-center overview');
  });

  it('provides safe localized error recovery and wires route boundaries', () => {
    const fallback = readFileSync(new URL('SuperadminSecurityOverviewErrorFallback.tsx', COMPONENTS), 'utf8');
    const loading = readFileSync(new URL('../loading.tsx', import.meta.url), 'utf8');
    const error = readFileSync(new URL('../error.tsx', import.meta.url), 'utf8');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
    expect(loading).toContain('SuperadminSecurityOverviewListSkeleton');
    expect(error).toContain('SuperadminSecurityOverviewErrorFallback');
    expect(error).not.toContain('...props');
  });
});
