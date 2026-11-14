// RESPONSIBILITY: Define source-level test coverage for users overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_overview/tests/SuperadminUsersOverviewValidationMessageHook.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useSuperadminUsersOverviewValidationMessage } from '@/app/frontend_superadmin/superadmin_users/users_overview/hooks/useSuperadminUsersOverviewValidationMessage';

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => `translated:${key}` }));

describe('useSuperadminUsersOverviewValidationMessage', () => {
  it('returns empty text for an absent validation message', () => {
    const { result } = renderHook(() => useSuperadminUsersOverviewValidationMessage());
    expect(result.current()).toBe('');
  });
  it('preserves external messages and translates stable module keys', () => {
    const { result } = renderHook(() => useSuperadminUsersOverviewValidationMessage());
    expect(result.current('Invalid input')).toBe('Invalid input');
    expect(result.current('SUPERADMIN_SAMPLE.VALIDATION.REQUIRED')).toBe('translated:SUPERADMIN_SAMPLE.VALIDATION.REQUIRED');
  });
});
