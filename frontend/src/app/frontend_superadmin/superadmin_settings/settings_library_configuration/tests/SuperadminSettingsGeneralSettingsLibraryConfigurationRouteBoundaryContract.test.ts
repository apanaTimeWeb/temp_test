// RESPONSIBILITY: Define source-level test coverage for settings library configuration using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_library_configuration/tests/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteBoundaryContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MODULE_ROOT = resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_settings/settings_library_configuration');
const COMPONENTS = resolve(MODULE_ROOT, 'components');

describe('superadmin_settings/settings_library_configuration route boundary contract', () => {
  it('wires accessible loading and retryable error boundaries', () => {
    const loading = readFileSync(resolve(MODULE_ROOT, 'loading.tsx'), 'utf8');
    const error = readFileSync(resolve(MODULE_ROOT, 'error.tsx'), 'utf8');
    const skeleton = readFileSync(resolve(COMPONENTS, 'SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx'), 'utf8');
    const fallback = readFileSync(resolve(COMPONENTS, 'SuperadminSettingsGeneralSettingsLibraryConfigurationErrorFallback.tsx'), 'utf8');
    expect(loading).toContain('SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton');
    expect(error).toContain('SuperadminSettingsGeneralSettingsLibraryConfigurationErrorFallback');
    expect(skeleton).toContain('role="status"');
    expect(skeleton).toContain('aria-busy="true"');
    expect(skeleton).toContain('motion-reduce:animate-none');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('onClick={onRetry}');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
  });

  it('has localized not-found recovery in both supported locales', () => {
    const notFound = readFileSync(resolve(MODULE_ROOT, 'not-found.tsx'), 'utf8');
    const en = JSON.parse(readFileSync(resolve(MODULE_ROOT, 'locales/superadmin_settings_general_settings_library_configuration_en.json'), 'utf8'));
    const hi = JSON.parse(readFileSync(resolve(MODULE_ROOT, 'locales/superadmin_settings_general_settings_library_configuration_hi.json'), 'utf8'));
    expect(notFound).toContain('COPY.MODULE_NOT_FOUND_TITLE');
    expect(notFound).toContain('href={SUPERADMIN_DASHBOARD_ROUTE}');
    for (const locale of [en, hi]) {
      expect(locale['SUPERADMIN_SYSTEM'].COPY.MODULE_NOT_FOUND_TITLE).toBeTruthy();
      expect(locale['SUPERADMIN_SYSTEM'].COPY.MODULE_NOT_FOUND_MESSAGE).toBeTruthy();
      expect(locale['SUPERADMIN_SYSTEM'].COPY.BACK_TO_DASHBOARD).toBeTruthy();
    }
  });
});
