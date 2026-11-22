// RESPONSIBILITY: Define source-level test coverage for libraries onboarding setup using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_onboarding_setup/tests/SuperadminLibrariesOnboardingSetupValidationMessageHook.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useSuperadminLibrariesOnboardingSetupValidationMessage } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/hooks/useSuperadminLibrariesOnboardingSetupValidationMessage';

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => `translated:${key}` }));

describe('useSuperadminLibrariesOnboardingSetupValidationMessage', () => {
  it('returns empty text for an absent validation message', () => {
    const { result } = renderHook(() => useSuperadminLibrariesOnboardingSetupValidationMessage());
    expect(result.current()).toBe('');
  });
  it('preserves external messages and translates stable module keys', () => {
    const { result } = renderHook(() => useSuperadminLibrariesOnboardingSetupValidationMessage());
    expect(result.current('Invalid input')).toBe('Invalid input');
    expect(result.current('SUPERADMIN_SAMPLE.VALIDATION.REQUIRED')).toBe('translated:SUPERADMIN_SAMPLE.VALIDATION.REQUIRED');
  });
});
