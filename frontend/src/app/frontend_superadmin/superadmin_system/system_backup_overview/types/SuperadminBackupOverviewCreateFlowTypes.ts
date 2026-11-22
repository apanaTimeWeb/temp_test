// FLOW: Feature source -> superadmin_system/system_backup_overview/types/SuperadminBackupOverviewCreateFlowTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Backup Types; defines module-owned type contracts for the named data boundary. */
export interface SuperadminBackupHistoryRecord {
  id: string;
  name: string;
  size: string;
  type: string;
  destination: string;
  status: string;
  date: string;
}

/**
 * Defines the public SuperadminBackupTab contract for backup overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminBackupTab = 'create' | 'history' | 'restore' | 'schedule';
