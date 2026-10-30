import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { Database, ChevronRight } from 'lucide-react';
import type useBackupsPage from '@/app/frontend_admin/admin_system/system_backups/hooks/useAdminSystemBackupsPage';
import { createAdminSystemBackupConfigSchema, type AdminSystemBackupConfigFormValues } from '@/app/frontend_admin/admin_system/system_backups/schemas/AdminSystemBackupsBackupConfigSchema';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import AdminSystemBackupsConfigurationSection from '@/app/frontend_admin/admin_system/system_backups/components/AdminSystemBackupsConfigurationSection';
import AdminSystemBackupsHistorySection from '@/app/frontend_admin/admin_system/system_backups/components/AdminSystemBackupsHistorySection';
import type { AdminSystemBackupsPageViewProps, AdminSystemBackupsSummarySectionProps } from '@/app/frontend_admin/admin_system/system_backups/types/AdminSystemBackupsTypes';
import { AdminSystemKpiCard } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveKpiCard';
import { displayValue } from '@/lib/display_value';

// RESPONSIBILITY: AdminSystemBackupsPageView component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

export default function AdminSystemBackupsPageView({ model }: AdminSystemBackupsPageViewProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const isDemoMode = isFrontendDemoModeEnabled();
  const { backupTime, retention, setBackupTime, setRetention } = model;
  const backupConfigSchema = useMemo(() => createAdminSystemBackupConfigSchema({
    backupTimeInvalid: t('BACKUP_VALIDATION_TIME_INVALID'), retentionMinimum: t('BACKUP_VALIDATION_RETENTION_MIN'),
    retentionMaximum: t('BACKUP_VALIDATION_RETENTION_MAX'), cloudProviderInvalid: t('BACKUP_VALIDATION_PROVIDER_INVALID'),
  }), [t]);
  const form = useForm<AdminSystemBackupConfigFormValues>({ resolver: zodResolver(backupConfigSchema), defaultValues: { backupTime, retention, cloudProvider: 'Google Drive' } });
  const handleSaveConfig = form.handleSubmit((values) => { if (!isDemoMode) { toast.error(t('BACKUP_CONFIG_BLOCKED'), { id: 'admin-system-backup-config-blocked' }); return; } setBackupTime(values.backupTime); setRetention(values.retention); toast.info(t('BACKUP_DEMO_SAVED'), { id: 'admin-system-backup-demo-saved' }); });
  return (
    <div>
      {!isDemoMode && <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('BACKUP_LIVE_UNAVAILABLE')}</p>}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{t('BREADCRUMB_SYSTEM')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('BACKUPS')}</span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-page-title font-bold text-text-primary flex items-center gap-3">
              <Database size={18} strokeWidth={2} className="text-primary" />
              {t('BACKUP_MANAGER')}
            </h1>
            <p className="text-text-secondary mt-1 text-sm">
              {t('BACKUP_MANAGER_DESCRIPTION')}
            </p>
          </div>
          <Button data-testid="admin_system-AdminSystemBackupsPageView-control-001"
            id="create-backup-btn"
            variant="primary"
            disabled
            title={t('BACKUP_CREATE_BLOCKED')}
          >
            <><Database size={18} strokeWidth={2} /> {t('CREATE_MANUAL_BACKUP')}</>
          </Button>
        </div>
      </div>
      <AdminSystemBackupsSummarySection model={model} isDemoMode={isDemoMode} />

      {/* Backup Configuration */}
      <AdminSystemBackupsConfigurationSection model={model} isDemoMode={isDemoMode} form={form} handleSaveConfig={handleSaveConfig} />
      <AdminSystemBackupsHistorySection model={model} />

    </div>
  );
}

export type { AdminSystemBackupsPageViewProps };

// RESPONSIBILITY: AdminSystemBackupsSummarySection component owned by admin_system; responsibility folder: admin_system_backups_page_view_sections.

export function AdminSystemBackupsSummarySection({ model, isDemoMode }: AdminSystemBackupsSummarySectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const { backups, successCount, failedCount, lastSuccess } = model;
  return (
    <>
      {/* KPI Cards */}
          {isDemoMode && <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <AdminSystemKpiCard title={t('TOTAL_BACKUPS')} value={backups.length}       icon="🗄️"  subtitle={t('ALL_TIME')}              />
            <AdminSystemKpiCard title={t('SUCCESSFUL')}    value={successCount}         icon="✅"   trend="up" trendLabel={t('RELIABLE')} />
            <AdminSystemKpiCard title={t('FAILED')}        value={failedCount}          icon="❌"   trend={failedCount > 0 ? 'down' : 'neutral'} trendLabel={failedCount > 0 ? t('NEEDS_ATTENTION') : t('ALL_GOOD')} />
            <AdminSystemKpiCard title={t('LAST_BACKUP')}   value={lastSuccess ? t('TODAY') : t('NEVER')} icon="🕐" subtitle={displayValue(lastSuccess?.createdAt)} />
          </div>}
    </>
  );
}
