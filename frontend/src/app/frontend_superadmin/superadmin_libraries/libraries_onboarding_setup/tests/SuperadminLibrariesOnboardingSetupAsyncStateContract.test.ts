// RESPONSIBILITY: Define source-level test coverage for libraries onboarding setup using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_onboarding_setup/tests/SuperadminLibrariesOnboardingSetupAsyncStateContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('libraries_onboarding_setup async-state contract', () => {
  it('uses an accessible reduced-motion-safe loading skeleton', () => {
    const source = readFileSync(resolve(__dirname, '../components/SuperadminLibrariesOnboardingSetupListSkeleton.tsx'), 'utf8');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('key={key}');
  });
  it('provides safe localized error recovery and wires route boundaries', () => {
    const fallback = readFileSync(resolve(__dirname, '../components/SuperadminLibrariesOnboardingSetupErrorFallback.tsx'), 'utf8');
    const loading = readFileSync(resolve(__dirname, '../loading.tsx'), 'utf8');
    const error = readFileSync(resolve(__dirname, '../error.tsx'), 'utf8');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
    expect(loading).toContain('SuperadminLibrariesOnboardingSetupListSkeleton');
    expect(error).toContain('SuperadminLibrariesOnboardingSetupErrorFallback');
    expect(error).not.toContain('...props');
  });
});
