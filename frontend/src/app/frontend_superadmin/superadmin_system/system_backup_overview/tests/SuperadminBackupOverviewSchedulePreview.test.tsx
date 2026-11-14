// RESPONSIBILITY: Define source-level test coverage for system backup overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_backup_overview/tests/SuperadminBackupOverviewSchedulePreview.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSuperadminBackupOverviewSchedulePreview } from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/hooks/useSuperadminBackupOverviewSchedulePreview';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => `${key}${values ? `:${String(values.days)}` : ''}`,
}));

describe('useSuperadminBackupOverviewSchedulePreview', () => {
  afterEach(cleanup);

  it('updates local retention and emits a preview notice without persistence', () => {
    const onPreviewNotice = vi.fn();
    const { result } = renderHook(() => useSuperadminBackupOverviewSchedulePreview(onPreviewNotice));
    expect(result.current.retention).toBe('30');
    act(() => result.current.setRetention('90'));
    act(() => result.current.previewSchedule());
    expect(result.current.preview).toContain('90');
    expect(onPreviewNotice).toHaveBeenCalledWith(result.current.preview);
  });
});
