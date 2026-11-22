// RESPONSIBILITY: Define source-level test coverage for system backup overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_backup_overview/tests/SuperadminBackupOverviewStateHook.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useSuperadminBackupOverviewState } from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/hooks/useSuperadminBackupOverviewState';
import { toast } from 'sonner';

vi.mock('sonner', () => ({ toast: { message: vi.fn() } }));

describe('useSuperadminBackupOverviewState', () => {
  it('starts on the create tab and emits deduplicated preview feedback', () => {
    const { result } = renderHook(() => useSuperadminBackupOverviewState());
    expect(result.current.activeTab).toBe('create');
    act(() => result.current.showPreviewNotice('Preview only'));
    expect(toast.message).toHaveBeenCalledWith('Preview only', { id: 'superadmin:backup:preview-notice' });
  });
});
