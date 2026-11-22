// RESPONSIBILITY: Define source-level test coverage for libraries onboarding setup using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_onboarding_setup/tests/SuperadminLibrariesOnboardingSetupFormatters.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { formatSuperadminSetupWizardMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/utils/SuperadminLibrariesOnboardingSetupFormatters';

describe('formatSuperadminSetupWizardMajorPreviewCurrency', () => {
  it('formats finite prices using the feature locale policy', () => {
    expect(formatSuperadminSetupWizardMajorPreviewCurrency(999, 'INR', 'en-IN')).toContain('999');
  });
  it('renders invalid preview values safely', () => {
    expect(formatSuperadminSetupWizardMajorPreviewCurrency(Number.NaN, 'INR', 'en-IN')).toBe('—');
  });
});
