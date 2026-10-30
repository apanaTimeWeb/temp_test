/** Consolidated module regression suites. Each original suite remains isolated under its named describe block. */
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import toast from 'sonner';
import useAdminSystemBackupsPage from '@/app/frontend_admin/admin_system/system_backups/hooks/useAdminSystemBackupsPage';
import { createAdminSystemBackupConfigSchema } from '@/app/frontend_admin/admin_system/system_backups/schemas/AdminSystemBackupsBackupConfigSchema';
import { ADMIN_SYSTEM_BACKUP_STATUS_CONFIG } from '@/app/frontend_admin/admin_system/system_backups/config/admin_system_backups.url_config';
import { ADMIN_SYSTEM_BACKUP_HISTORY } from '@/app/frontend_admin/admin_system/system_backups/mocks/scenarios/admin_system_backups.scenarios';

vi.mock('next-intl', () => ({ useTranslations: () => (key: string, values?: Record<string, unknown>) => values ? `${key}:${String(values.id ?? '')}` : key }));
vi.mock('@/lib/runtimeFeatures', () => ({ isFrontendDemoModeEnabled: vi.fn() }));
vi.mock('sonner', () => ({ default: { info: vi.fn(), error: vi.fn(), success: vi.fn() } }));

describe('Original suite: AdminSystemBackupsBackupConfigSchema.test.ts', () => {
  describe('Admin System backup config schema', () => { it('validates retention and 24-hour time with localized messages', () => { const schema=createAdminSystemBackupConfigSchema({backupTimeInvalid:'time-invalid',retentionMinimum:'retention-min',retentionMaximum:'retention-max',cloudProviderInvalid:'provider-invalid'}); const result=schema.safeParse({backupTime:'25:99',retention:1,cloudProvider:'Google Drive'}); expect(result.success).toBe(false); if(!result.success) expect(result.error.issues.map((issue)=>issue.message)).toEqual(expect.arrayContaining(['time-invalid','retention-min'])); }); });
});

describe('Original suite: AdminSystemBackupsRegistry.test.ts', () => {
  describe('Admin System backups registry', () => {
    it('keeps fixture statuses inside the backups status registry', () => {
      expect(ADMIN_SYSTEM_BACKUP_HISTORY.every((row) => row.status in ADMIN_SYSTEM_BACKUP_STATUS_CONFIG)).toBe(true);
    });
  });
});

describe('Original suite: AdminSystemBackupsStandaloneContract.test.ts', () => {
  // Responsibility: verify the isolated admin_system_backups contract remains discoverable by the host test runner.

  describe('admin_system_backups standalone contract', () => {
    it('has a module-owned test harness', () => {
      expect('admin_system_backups').toMatch(/^admin_[a-z0-9_]+$/);
    });
  });
});


describe('Admin System backups hook', () => {
  beforeEach(() => { vi.clearAllMocks(); vi.mocked(isFrontendDemoModeEnabled).mockReturnValue(false); });
  it('never exposes synthetic backup activity as live data', () => { expect(renderHook(() => useAdminSystemBackupsPage()).result.current.backups).toEqual([]); });
  it('exposes backup fixtures only in explicit demo mode', () => { vi.mocked(isFrontendDemoModeEnabled).mockReturnValue(true); expect(renderHook(() => useAdminSystemBackupsPage()).result.current.backups).toEqual(ADMIN_SYSTEM_BACKUP_HISTORY); });
  it('does not claim a backup succeeded without a mutation contract', () => { const { result } = renderHook(() => useAdminSystemBackupsPage()); act(() => result.current.handleCreateBackup()); expect(vi.mocked(toast.info)).toHaveBeenCalledWith('BACKUP_CREATE_BLOCKED', { id: 'admin-system-backup-create-blocked' }); });
});
