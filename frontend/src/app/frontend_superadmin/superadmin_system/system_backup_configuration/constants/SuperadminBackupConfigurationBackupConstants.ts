// FLOW: Feature consumers -> superadmin_system/system_backup_configuration/constants/SuperadminBackupConfigurationBackupConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin System Backup Constants; centralizes stable module-owned options and configuration. */
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export const SUPERADMIN_SYSTEM_BACKUP_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  IN_PROGRESS: 'in-progress',
} as const;

export const SUPERADMIN_SYSTEM_BACKUP_STATUS_CONFIG = {
  [SUPERADMIN_SYSTEM_BACKUP_STATUS.SUCCESS]:     { labelKey: 'COPY.BACKUP_STATUS_SUCCESS',     variant: 'success' as const, icon: CheckCircle  },
  [SUPERADMIN_SYSTEM_BACKUP_STATUS.FAILED]:      { labelKey: 'COPY.BACKUP_STATUS_FAILED',      variant: 'danger'  as const, icon: AlertTriangle },
  [SUPERADMIN_SYSTEM_BACKUP_STATUS.IN_PROGRESS]:{ labelKey: 'COPY.BACKUP_STATUS_IN_PROGRESS', variant: 'warning' as const, icon: Loader2      },
};
