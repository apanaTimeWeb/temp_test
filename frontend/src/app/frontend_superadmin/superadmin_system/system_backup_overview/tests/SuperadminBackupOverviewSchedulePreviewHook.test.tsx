// RESPONSIBILITY: Define source-level test coverage for system backup overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_backup_overview/tests/SuperadminBackupOverviewSchedulePreviewHook.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useSuperadminBackupOverviewSchedulePreview } from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/hooks/useSuperadminBackupOverviewSchedulePreview';
vi.mock('next-intl', () => ({ useTranslations: () => (key: string, values?: Record<string, unknown>) => `${key}:${values?.days ?? ''}` }));

describe('useSuperadminBackupOverviewSchedulePreview', () => {
  it('keeps schedule changes local and notifies the preview owner', () => {
    const notify = vi.fn();
    const { result } = renderHook(() => useSuperadminBackupOverviewSchedulePreview(notify));
    for (const retention of ['7', '30', '90']) {
      act(() => result.current.setRetention(retention));
      act(() => result.current.previewSchedule());
      expect(result.current.preview).toContain(retention);
      expect(notify).toHaveBeenLastCalledWith(result.current.preview);
    }
  });
});
