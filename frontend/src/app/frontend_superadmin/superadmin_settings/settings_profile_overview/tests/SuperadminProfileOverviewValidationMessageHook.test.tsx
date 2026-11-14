// RESPONSIBILITY: Define source-level test coverage for settings profile overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_profile_overview/tests/SuperadminProfileOverviewValidationMessageHook.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useSuperadminProfileOverviewValidationMessage } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/hooks/useSuperadminProfileOverviewValidationMessage';

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => `translated:${key}` }));

describe('useSuperadminProfileOverviewValidationMessage', () => {
  it('returns empty text for an absent validation message', () => {
    const { result } = renderHook(() => useSuperadminProfileOverviewValidationMessage());
    expect(result.current()).toBe('');
  });
  it('preserves external messages and translates stable module keys', () => {
    const { result } = renderHook(() => useSuperadminProfileOverviewValidationMessage());
    expect(result.current('Invalid input')).toBe('Invalid input');
    expect(result.current('SUPERADMIN_SAMPLE.VALIDATION.REQUIRED')).toBe('translated:SUPERADMIN_SAMPLE.VALIDATION.REQUIRED');
  });
});
