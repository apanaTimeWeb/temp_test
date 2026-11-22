// FLOW: Feature source -> superadmin_system/system_backup_configuration/types/SuperadminBackupConfigurationBackupTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin System Backup Types; defines module-owned type contracts for the named data boundary. */
import type { SUPERADMIN_SYSTEM_BACKUP_STATUS } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/constants/SuperadminBackupConfigurationBackupConstants';

export interface SuperadminSystemBackupRecord {
  id: string;
  name: string;
  type: 'auto' | 'manual';
  size: string;
  createdAt: string;
  status: (typeof SUPERADMIN_SYSTEM_BACKUP_STATUS)[keyof typeof SUPERADMIN_SYSTEM_BACKUP_STATUS];
  modules: string[];
}
