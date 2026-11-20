// api/superadmin_data_backup_operations.api.ts
import { apiFetch, type ApiResponse } from '@/lib/api';
import { SUPERADMIN_DATA_BACKUP_OPERATIONS_API } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/config/superadmin_data_backup_operations.url_config';
import type {
  SuperadminBackupSchedule,
  SuperadminFullPlatformBackupRequest,
} from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/types/superadmin_data_backup_operations.types';
import type { SuperadminBackupScheduleFormValues } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/schemas/superadmin_data_backup_operations.schemas';

export async function fetchSuperadminBackupSchedules(): Promise<ApiResponse<SuperadminBackupSchedule[]>> {
  return apiFetch<SuperadminBackupSchedule[]>(SUPERADMIN_DATA_BACKUP_OPERATIONS_API.getSchedules);
}

export async function createSuperadminBackupSchedule(
  payload: SuperadminBackupScheduleFormValues,
  idempotencyKey: string
): Promise<ApiResponse<SuperadminBackupSchedule>> {
  return apiFetch<SuperadminBackupSchedule>(SUPERADMIN_DATA_BACKUP_OPERATIONS_API.createSchedule, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
}

export async function toggleSuperadminBackupScheduleStatus(
  id: string,
  isActive: boolean,
  idempotencyKey: string
): Promise<ApiResponse<SuperadminBackupSchedule>> {
  return apiFetch<SuperadminBackupSchedule>(SUPERADMIN_DATA_BACKUP_OPERATIONS_API.toggleScheduleStatus(id), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({ isActive }),
  });
}

export async function triggerSuperadminFullPlatformBackup(
  payload: SuperadminFullPlatformBackupRequest,
  idempotencyKey: string
): Promise<ApiResponse<{ snapshotId: string; status: string; estimatedCompletionTime: string }>> {
  return apiFetch<{ snapshotId: string; status: string; estimatedCompletionTime: string }>(
    SUPERADMIN_DATA_BACKUP_OPERATIONS_API.triggerFullPlatformBackup,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(payload),
    }
  );
}
