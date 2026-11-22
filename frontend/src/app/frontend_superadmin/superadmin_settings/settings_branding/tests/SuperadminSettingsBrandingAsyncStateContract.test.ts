// RESPONSIBILITY: Define source-level test coverage for settings branding using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_branding/tests/SuperadminSettingsBrandingAsyncStateContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const componentsDir = resolve(here, '../components');

describe('settings_branding async-state contract', () => {
  it('uses an accessible reduced-motion-safe loading skeleton', () => {
    const source = readFileSync(resolve(componentsDir, 'SuperadminSettingsBrandingListSkeleton.tsx'), 'utf8');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('key={key}');
  });
  it('provides safe localized error recovery and wires route boundaries', () => {
    const fallback = readFileSync(resolve(componentsDir, 'SuperadminSettingsBrandingErrorFallback.tsx'), 'utf8');
    const loading = readFileSync(resolve(here, '../loading.tsx'), 'utf8');
    const error = readFileSync(resolve(here, '../error.tsx'), 'utf8');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
    expect(loading).toContain('SuperadminSettingsBrandingListSkeleton');
    expect(error).toContain('SuperadminSettingsBrandingErrorFallback');
    expect(error).not.toContain('...props');
  });
});
