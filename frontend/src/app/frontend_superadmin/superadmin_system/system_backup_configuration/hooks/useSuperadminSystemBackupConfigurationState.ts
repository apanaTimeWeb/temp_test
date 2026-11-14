// RESPONSIBILITY: Own local backup schedule and cloud-sync preview state; no backup, upload, or save operation is performed.
// FLOW: Backup-configuration page -> module-owned state hook -> local schedule/configuration preview -> UI feedback.
import { useState } from 'react';
import { SUPERADMIN_SYSTEM_BACKUP_HISTORY } from '../mocks/fixtures/SuperadminBackupConfigurationBackupMockFixtures';
import type { SuperadminSystemBackupRecord } from '../types/SuperadminBackupConfigurationBackupTypes';

/**
 * Returns local backup/cloud preview settings and sample history. No backup or cloud operation is performed.
 * @returns Module-local UI state and stable React state setters.
 
 * @param initialOperationMessage - Input supplied by the caller under the declared TypeScript contract.
 */
export function useSuperadminSystemBackupConfigurationState(initialOperationMessage: string) {
  const [autoBackup, setAutoBackup] = useState(true);
  const [cloudSync, setCloudSync] = useState(true);
  const [backupTime, setBackupTime] = useState('02:00');
  const [retention, setRetention] = useState(30);
  const [backups] = useState<SuperadminSystemBackupRecord[]>(SUPERADMIN_SYSTEM_BACKUP_HISTORY);
  const [operationMessage, setOperationMessage] = useState(initialOperationMessage);
  return { autoBackup, setAutoBackup, cloudSync, setCloudSync, backupTime, setBackupTime, retention, setRetention, backups, operationMessage, setOperationMessage };
}
