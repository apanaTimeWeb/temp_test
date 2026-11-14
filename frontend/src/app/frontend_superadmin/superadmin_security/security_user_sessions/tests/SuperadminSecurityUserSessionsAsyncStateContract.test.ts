// RESPONSIBILITY: Define source-level test coverage for security user sessions using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_security/security_user_sessions/tests/SuperadminSecurityUserSessionsAsyncStateContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const COMPONENTS = new URL('../components/', import.meta.url);

describe('security_user_sessions async-state contract', () => {
  it('uses an accessible reduced-motion-safe loading skeleton', () => {
    const source = readFileSync(new URL('SuperadminSecurityUserSessionsListSkeleton.tsx', COMPONENTS), 'utf8');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('key={key}');
  });
  it('provides safe localized error recovery and wires route boundaries', () => {
    const fallback = readFileSync(new URL('SuperadminSecurityUserSessionsErrorFallback.tsx', COMPONENTS), 'utf8');
    const loading = readFileSync(new URL('../loading.tsx', import.meta.url), 'utf8');
    const error = readFileSync(new URL('../error.tsx', import.meta.url), 'utf8');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
    expect(loading).toContain('SuperadminSecurityUserSessionsListSkeleton');
    expect(error).toContain('SuperadminSecurityUserSessionsErrorFallback');
    expect(error).not.toContain('...props');
  });
});
