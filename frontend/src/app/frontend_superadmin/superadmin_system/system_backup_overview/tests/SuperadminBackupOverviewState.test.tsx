// RESPONSIBILITY: Define source-level test coverage for system backup overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_backup_overview/tests/SuperadminBackupOverviewState.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSuperadminBackupOverviewState } from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/hooks/useSuperadminBackupOverviewState';

describe('useSuperadminBackupOverviewState', () => {
  afterEach(() => { cleanup(); vi.useRealTimers(); });

  it('starts on create and changes the selected module tab', () => {
    const { result } = renderHook(() => useSuperadminBackupOverviewState());
    expect(result.current.activeTab).toBe('create');
    act(() => result.current.setActiveTab('history'));
    expect(result.current.activeTab).toBe('history');
  });

  it('uses the shared Sonner notification contract rather than hook-owned toast state', () => {
    const { result } = renderHook(() => useSuperadminBackupOverviewState());
    expect(result.current).not.toHaveProperty('toast');
    expect(typeof result.current.showPreviewNotice).toBe('function');
  });
});
