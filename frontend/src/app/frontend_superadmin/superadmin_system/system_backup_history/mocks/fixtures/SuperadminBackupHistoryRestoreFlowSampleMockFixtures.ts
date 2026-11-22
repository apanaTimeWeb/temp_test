// RESPONSIBILITY: Define local sample fixtures for system backup history; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_system/system_backup_history/mocks/fixtures/SuperadminBackupHistoryRestoreFlowSampleMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminBackupHistoryRecord } from '@/app/frontend_superadmin/superadmin_system/system_backup_history/types/SuperadminBackupHistoryRestoreFlowTypes';

/** Synthetic presentation-only rows. These are not evidence of real backups. */
export const SUPERADMIN_BACKUP_SAMPLE_HISTORY: readonly SuperadminBackupHistoryRecord[] = [
  { id: 'sample-backup-001', name: 'SAMPLE-backup-demo-001.sql.gz', size: 'Demo size', type: 'Sample (not scheduled)', destination: 'Demo storage', status: 'Sample', date: 'Illustrative only' },
  { id: 'sample-backup-002', name: 'SAMPLE-backup-demo-002.sql.gz', size: 'Demo size', type: 'Sample (not scheduled)', destination: 'Demo storage', status: 'Sample', date: 'Illustrative only' },
  { id: 'sample-backup-003', name: 'SAMPLE-backup-demo-003.sql.gz', size: 'Demo size', type: 'Manual sample', destination: 'Demo storage', status: 'Sample', date: 'Illustrative only' },
];
