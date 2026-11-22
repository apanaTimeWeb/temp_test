// RESPONSIBILITY: Define source-level test coverage for libraries overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_overview/tests/SuperadminLibrariesOverviewHook.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSuperadminLibrariesOverview } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/hooks/useSuperadminLibrariesOverview';

describe('useSuperadminLibrariesOverview', () => {
  it('updates only the selected preview record and rejects unknown IDs', async () => {
    const { result } = renderHook(() => useSuperadminLibrariesOverview());
    const first = result.current.libraries[0];
    await act(async () => { await result.current.toggleStatus(first.id); });
    expect(result.current.libraries.find((item) => item.id === first.id)?.status).not.toBe(first.status);
    await expect(result.current.toggleStatus('missing-id')).rejects.toThrow(/no longer available/i);
  });
});
