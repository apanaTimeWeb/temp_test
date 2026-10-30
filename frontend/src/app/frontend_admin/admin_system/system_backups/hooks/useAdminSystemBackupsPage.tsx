'use client';
// DATA FLOW: system_backups route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_SYSTEM_BACKUP_HISTORY } from '@/app/frontend_admin/admin_system/system_backups/mocks/scenarios/admin_system_backups.scenarios';
import type { AdminSystemBackupRecord } from '@/app/frontend_admin/admin_system/system_backups/types/AdminSystemBackupsTypes';
export default function useAdminSystemBackupsPage() {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const isDemoMode = isFrontendDemoModeEnabled();
const [autoBackup, setAutoBackup]   = useState(true);
  const [cloudSync, setCloudSync]     = useState(true);
  const [backupTime, setBackupTime]   = useState('02:00');
  const [retention, setRetention]     = useState(30);
  const [creating, setCreating]       = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [backups, setBackups]         = useState<AdminSystemBackupRecord[]>(isDemoMode ? ADMIN_SYSTEM_BACKUP_HISTORY : []);

  const successCount = backups.filter(b => b.status === 'success').length;
  const failedCount  = backups.filter(b => b.status === 'failed').length;
  const lastSuccess  = backups.find(b => b.status === 'success');

  const handleCreateBackup = () => {
    toast.info(t('BACKUP_CREATE_BLOCKED'), { id: 'admin-system-backup-create-blocked' });
  };

  const handleDownload = (id: string) => {
    toast.info(t('BACKUP_DOWNLOAD_BLOCKED', { id }), { id: `admin-system-backup-download-${id}` });
  };

  const handleDeleteBackup = (id: string) => {
    toast.info(t('BACKUP_DELETE_BLOCKED', { id }), { id: `admin-system-backup-delete-${id}` });
  };

  return {
    isDemoMode,
    autoBackup,
    setAutoBackup,
    cloudSync,
    setCloudSync,
    backupTime,
    setBackupTime,
    retention,
    setRetention,
    creating,
    setCreating,
    downloading,
    setDownloading,
    backups,
    setBackups,
    successCount,
    failedCount,
    lastSuccess,
    handleCreateBackup,
    handleDownload,
    handleDeleteBackup,
  } as const;
}
