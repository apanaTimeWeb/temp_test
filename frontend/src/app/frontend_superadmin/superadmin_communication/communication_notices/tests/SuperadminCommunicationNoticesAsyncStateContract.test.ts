// RESPONSIBILITY: Define source-level test coverage for communication notices using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_communication/communication_notices/tests/SuperadminCommunicationNoticesAsyncStateContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS = resolve(__dirname, '../components');

describe('communication_notices async-state contract', () => {
  it('uses an accessible reduced-motion-safe loading skeleton', () => {
    const source = readFileSync(resolve(COMPONENTS, 'SuperadminCommunicationNoticesListSkeleton.tsx'), 'utf8');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('key={key}');
  });
  it('provides safe localized error recovery and wires route boundaries', () => {
    const fallback = readFileSync(resolve(COMPONENTS, 'SuperadminCommunicationNoticesErrorFallback.tsx'), 'utf8');
    const loading = readFileSync(resolve(__dirname, '../loading.tsx'), 'utf8');
    const error = readFileSync(resolve(__dirname, '../error.tsx'), 'utf8');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
    expect(loading).toContain('SuperadminCommunicationNoticesListSkeleton');
    expect(error).toContain('SuperadminCommunicationNoticesErrorFallback');
    expect(error).not.toContain('...props');
  });
});
