// RESPONSIBILITY: Define source-level test coverage for support complaints using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_support/support_complaints/tests/SuperadminSupportComplaintsAsyncStateContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS = resolve(__dirname, '../components');

describe('support_complaints async-state contract', () => {
  it('renders the feature-local list skeleton for the non-Suspense query pending state', () => {
    const page = readFileSync(resolve(__dirname, '../components/SuperadminSupportComplaintsPageClient.tsx'), 'utf8');
    expect(page).toContain('complaintsQuery.isPending ? <SuperadminSupportComplaintsListSkeleton />');
    expect(page).not.toContain('COPY.LOADING_COMPLAINTS');
  });
  it('uses an accessible reduced-motion-safe loading skeleton', () => {
    const source = readFileSync(resolve(COMPONENTS, 'SuperadminSupportComplaintsListSkeleton.tsx'), 'utf8');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('key={key}');
  });
  it('provides safe localized error recovery and wires route boundaries', () => {
    const fallback = readFileSync(resolve(COMPONENTS, 'SuperadminSupportComplaintsErrorFallback.tsx'), 'utf8');
    const loading = readFileSync(resolve(__dirname, '../loading.tsx'), 'utf8');
    const error = readFileSync(resolve(__dirname, '../error.tsx'), 'utf8');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
    expect(loading).toContain('SuperadminSupportComplaintsListSkeleton');
    expect(error).toContain('SuperadminSupportComplaintsErrorFallback');
    expect(error).not.toContain('...props');
  });
});
