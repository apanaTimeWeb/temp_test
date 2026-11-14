// RESPONSIBILITY: Define compile-time types for system backup configuration; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_backup_configuration/types/SuperadminBackupConfigurationBackupHistoryComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_views/superadmin_backup_configuration_page/SuperadminBackupConfigurationBackupHistory.tsx. */
import type { SuperadminSystemBackupRecord } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/types/SuperadminBackupConfigurationBackupTypes';

/**
 * Defines the public SuperadminSystemBackupHistoryProps contract for backup configuration. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property backups Value defined by the existing feature-local contract. Declared type: SuperadminSystemBackupRecord[].
 */
export interface SuperadminSystemBackupHistoryProps { backups: SuperadminSystemBackupRecord[]; }
