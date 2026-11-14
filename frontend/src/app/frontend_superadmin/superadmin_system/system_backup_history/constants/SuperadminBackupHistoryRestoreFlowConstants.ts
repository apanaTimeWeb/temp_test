// FLOW: Feature consumers -> superadmin_system/system_backup_history/constants/SuperadminBackupHistoryRestoreFlowConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Backup Constants; centralizes stable module-owned options and configuration. */
import { Clock, CloudUpload, Database, RotateCcw, Settings } from 'lucide-react';
import type { SuperadminBackupTab } from '@/app/frontend_superadmin/superadmin_system/system_backup_history/types/SuperadminBackupHistoryRestoreFlowTypes';
export const SUPERADMIN_BACKUP_TABS: { id: SuperadminBackupTab; icon: typeof Database; labelKey: 'COPY.CREATE_BACKUP' | 'COPY.BACKUP_HISTORY' | 'COPY.RESTORE_POINT' | 'COPY.AUTOMATED_SCHEDULES' }[] = [
  { id: 'create', labelKey: 'COPY.CREATE_BACKUP', icon: CloudUpload },
  { id: 'history', labelKey: 'COPY.BACKUP_HISTORY', icon: Clock },
  { id: 'restore', labelKey: 'COPY.RESTORE_POINT', icon: RotateCcw },
  { id: 'schedule', labelKey: 'COPY.AUTOMATED_SCHEDULES', icon: Settings },
];

export const SUPERADMIN_BACKUP_RETENTION_OPTIONS = [
  { value: '7', labelKey: 'COPY.KEEP_LAST_7_DAYS' },
  { value: '30', labelKey: 'COPY.KEEP_LAST_30_DAYS' },
  { value: '90', labelKey: 'COPY.KEEP_LAST_90_DAYS' },
] as const;
