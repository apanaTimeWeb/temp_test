// RESPONSIBILITY: Define compile-time types for system backup schedules; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_backup_schedules/types/SuperadminBackupSchedulesHistoryPanelComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_backup/superadmin_backup_components/superadmin_backup_operation_panels/SuperadminBackupSchedulesHistoryPanel.tsx. */
import type { SuperadminBackupHistoryRecord } from '@/app/frontend_superadmin/superadmin_system/system_backup_schedules/types/SuperadminBackupSchedulesTypes';

/**
 * Defines the public SuperadminBackupHistoryPanelProps contract for backup schedules. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property records Value defined by the existing feature-local contract. Declared type: readonly SuperadminBackupHistoryRecord[].
 */
export interface SuperadminBackupHistoryPanelProps {
  records: readonly SuperadminBackupHistoryRecord[];
}
