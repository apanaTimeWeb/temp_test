import type useBackupsPage from '@/app/frontend_admin/admin_system/system_backups/hooks/useAdminSystemBackupsPage';
import type { AdminSystemBackupConfigFormValues } from '@/app/frontend_admin/admin_system/system_backups/schemas/AdminSystemBackupsBackupConfigSchema';
import type { AdminSystemBackupsScenario } from '@/app/frontend_admin/admin_system/system_backups/tests/harness/bootstrap';
import type { BaseSyntheticEvent, ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export interface AdminSystemBackupRecord {
  id: string;
  name: string;
  type: AdminSystemBackupRecordType;
  size: string;
  createdAt: string;
  status: AdminSystemBackupRecordStatus;
  modules: string[];
}

export type AdminSystemBackupRecordType = 'auto' | 'manual';
export type AdminSystemBackupRecordStatus = 'success' | 'failed' | 'in-progress';

export interface AdminSystemBackupsConfigurationSectionProps {
  model: ReturnType<typeof useBackupsPage>;
  isDemoMode: boolean;
  form: UseFormReturn<AdminSystemBackupConfigFormValues>;
  handleSaveConfig: (event?: BaseSyntheticEvent) => Promise<void>;
}

export interface AdminSystemBackupsHistorySectionProps {
  model: ReturnType<typeof useBackupsPage>;
}

export interface AdminSystemBackupsPageViewProps {
  model: ReturnType<typeof useBackupsPage>;
}

export interface AdminSystemBackupsSummarySectionProps {
  model: ReturnType<typeof useBackupsPage>;
  isDemoMode: boolean;
}

export interface AdminSystemBackupsHarnessProps {
  children: ReactNode;
  scenario?: AdminSystemBackupsScenario;
}

export type AdminSystemBackupsadmin_system_backups_constantsVariant = 'success' | 'danger' | 'warning';
