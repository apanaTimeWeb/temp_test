import { AlertTriangle, CheckCircle, Clock, Loader2, type LucideIcon } from 'lucide-react';
import type { AdminSystemBackupRecord } from '@/app/frontend_admin/admin_system/system_backups/types/AdminSystemBackupsTypes';
import type { AdminSystemBackupsadmin_system_backups_constantsVariant } from '@/app/frontend_admin/admin_system/system_backups/types/AdminSystemBackupsTypes';

/**
 * Canonical UI/API contract for admin_system_backups.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_SYSTEM_BACKUPS_ROUTES = {
  ROOT: '/admin/admin_system/system_backups',
} as const;

export const ADMIN_SYSTEM_BACKUPS_API = {
  /** Source-observed domain API base only; feature operations and response DTOs remain CONTRACT_MISSING. */
  BASE_PATH: '/api/v1/admin/system',
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_SYSTEM_BACKUPS_CANONICAL_ROUTE = ADMIN_SYSTEM_BACKUPS_ROUTES.ROOT;

type AdminSystemBackupStatus = AdminSystemBackupRecord['status'];

export const ADMIN_SYSTEM_BACKUP_STATUS_CONFIG: Record<AdminSystemBackupStatus, { label: string; variant: AdminSystemBackupsadmin_system_backups_constantsVariant; icon: LucideIcon }> = {
  success: { label: 'Success', variant: 'success', icon: CheckCircle },
  failed: { label: 'Failed', variant: 'danger', icon: AlertTriangle },
  'in-progress': { label: 'In Progress', variant: 'warning', icon: Loader2 },
};
