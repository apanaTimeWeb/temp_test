// mocks/handlers/superadmin_data_backup_operations.handlers.ts
import { SUPERADMIN_DATA_BACKUP_OPERATIONS_API } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/config/superadmin_data_backup_operations.url_config';
import { SUPERADMIN_DATA_BACKUP_OPERATIONS_SCENARIOS } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/mocks/scenarios/superadmin_data_backup_operations.scenarios';

export interface MockRequestHandler {
  url: string;
  method: string;
  handle: (req?: unknown) => { status: number; body: unknown };
}

export const superadminDataBackupOperationsMockHandlers: MockRequestHandler[] = [
  {
    url: SUPERADMIN_DATA_BACKUP_OPERATIONS_API.getSchedules,
    method: 'GET',
    handle: () => ({
      status: SUPERADMIN_DATA_BACKUP_OPERATIONS_SCENARIOS.ACTIVE.status,
      body: SUPERADMIN_DATA_BACKUP_OPERATIONS_SCENARIOS.ACTIVE.envelope,
    }),
  },
  {
    url: SUPERADMIN_DATA_BACKUP_OPERATIONS_API.createSchedule,
    method: 'POST',
    handle: (req: unknown) => ({
      status: 201,
      body: {
        success: true,
        message: 'Backup policy schedule created successfully',
        data: {
          id: `sched-${Date.now()}`,
          name: 'New Custom Schedule',
          frequency: 'DAILY',
          cronExpression: '0 0 * * *',
          scope: 'FULL_PLATFORM',
          storageTarget: 'DUAL_REGION',
          retentionDays: 30,
          encryptionStandard: 'AES_256_GCM',
          isActive: true,
          nextRunTimestamp: 'Tonight at 00:00 UTC',
        },
        requestId: `req-create-${Date.now()}`,
      },
    }),
  },
  {
    url: SUPERADMIN_DATA_BACKUP_OPERATIONS_API.triggerFullPlatformBackup,
    method: 'POST',
    handle: () => ({
      status: 200,
      body: {
        success: true,
        message: 'Full Platform Backup snapshot initiated and queued for dual-cloud sync',
        data: {
          snapshotId: `snap-full-${Date.now()}`,
          status: 'IN_PROGRESS',
          estimatedCompletionTime: '8 minutes',
        },
        requestId: `req-full-${Date.now()}`,
      },
    }),
  },
];
