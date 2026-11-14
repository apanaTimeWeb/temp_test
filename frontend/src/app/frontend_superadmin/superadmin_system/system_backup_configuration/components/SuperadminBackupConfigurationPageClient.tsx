'use client';
import SuperadminBackupConfigurationEmptyState from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/components/SuperadminBackupConfigurationEmptyState';
import { useSuperadminSystemBackupConfigurationState } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/hooks/useSuperadminSystemBackupConfigurationState';
/** Responsibility: Superadmin System Backups Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminBackupConfigurationPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations } from 'next-intl';

import SuperadminBackupConfigurationBackupHistory from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/components/SuperadminBackupConfigurationBackupHistory';
import { SuperadminBackupConfigurationCard as Card } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/components/SuperadminBackupConfigurationCard';
import { SuperadminBackupConfigurationCardHeader as CardHeader } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/components/SuperadminBackupConfigurationCardHeader';
import { SuperadminBackupConfigurationCardTitle as CardTitle } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/components/SuperadminBackupConfigurationCardTitle';
import { SuperadminBackupConfigurationCardDescription as CardDescription } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/components/SuperadminBackupConfigurationCardDescription';
import { SuperadminBackupConfigurationCardContent as CardContent } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/components/SuperadminBackupConfigurationCardContent';
import { SuperadminBackupConfigurationCardFooter as CardFooter } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/components/SuperadminBackupConfigurationCardFooter';
import { SuperadminBackupConfigurationButton as Button } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/components/SuperadminBackupConfigurationButton';
import { SuperadminBackupConfigurationKpiCard as KpiCard } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/components/SuperadminBackupConfigurationKpiCard';
import { SuperadminBackupConfigurationSwitch as Switch } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/components/SuperadminBackupConfigurationSwitch';
import { Database, ChevronRight, Clock, HardDrive, Shield, Cloud } from 'lucide-react';
import { SUPERADMIN_BACKUP_PROVIDER_OPTIONS } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/constants/SuperadminBackupConfigurationStaticConstants';
import { SUPERADMIN_SYSTEM_BACKUP_STATUS } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/constants/SuperadminBackupConfigurationBackupConstants';

/**
 * Renders the `superadmin_system` view owned by `SuperadminBackupConfigurationPageClient`.
 * Owns local UI state for `autoBackup`, `cloudSync`, `backupTime`, `retention`, `operationMessage`.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminBackupConfigurationPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const { autoBackup, setAutoBackup, cloudSync, setCloudSync, backupTime, setBackupTime, retention, setRetention, backups, operationMessage, setOperationMessage } = useSuperadminSystemBackupConfigurationState(tCopy('COPY.BACKUP_PREVIEW_BOUNDARY_MESSAGE'));

  const successCount = backups.filter(b => b.status === SUPERADMIN_SYSTEM_BACKUP_STATUS.SUCCESS).length;
  const failedCount  = backups.filter(b => b.status === SUPERADMIN_SYSTEM_BACKUP_STATUS.FAILED).length;
  const lastSuccess  = backups.find(b => b.status === SUPERADMIN_SYSTEM_BACKUP_STATUS.SUCCESS);


  return (
    <div>
      {(backups?.length === 0) && <SuperadminBackupConfigurationEmptyState filtered />}

      <p className="mb-5 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{operationMessage}</p>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{tCopy("COPY.SYSTEM")}</span><ChevronRight size={12} /><span>{tCopy("COPY.BACKUPS")}</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
              <Database size={28} className="text-primary" />
              {tCopy("COPY.BACKUP_MANAGER")}</h1>
            <p className="text-secondary mt-1 text-sm">
              {tCopy("COPY.PREVIEW_SCHEDULE_AND_SAMPLE_HISTORY_ONLY_SCHEDULING_CLOUD_SYNC_AND_13461CC0")}</p>
          </div>
          <Button
            id="create-backup-btn"
            variant="primary"
            disabled
            title={tCopy("COPY.UNAVAILABLE_NO_VERIFIED_BACKUP_EXECUTION_API_SERVICE_IS_SUPPLIED_N_1F5EAF10")}
            aria-label={tCopy("COPY.CREATE_MANUAL_BACKUP_UNAVAILABLE")}
           data-testid="superadmin_system_backup_configuration-create-backup-btn">
            <Database size={16} /> {tCopy("COPY.MANUAL_BACKUP_UNAVAILABLE")}</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <KpiCard title={tCopy("COPY.TOTAL_BACKUPS")} value={backups.length}       icon="🗄️"  subtitle={tCopy("COPY.ALL_TIME")}              />
        <KpiCard title={tCopy("COPY.SUCCESSFUL_SAMPLE")} value={successCount} icon="✅" trend="neutral" trendLabel={tCopy("COPY.ILLUSTRATIVE")} />
        <KpiCard title={tCopy("COPY.FAILED_SAMPLE")} value={failedCount} icon="❌" trend="neutral" trendLabel={tCopy("COPY.ILLUSTRATIVE")} />
        <KpiCard title={tCopy("COPY.LAST_BACKUP")}   value={lastSuccess ? tCopy('COPY.NO_RECORD_SAMPLE') : tCopy('COPY.NO_RECORD_NONE')} icon="🕐" subtitle={lastSuccess?.createdAt ?? '—'} />
      </div>

      {/* Backup Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Auto Backup Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={18} className="text-primary" /> {tCopy("COPY.AUTOMATIC_BACKUP_SCHEDULE")}</CardTitle>
            <CardDescription>{tCopy("COPY.CONFIGURE_NIGHTLY_BACKUP_SCHEDULE_AND_RETENTION_PERIOD")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
              <div>
                <p className="text-sm font-semibold text-primary">{tCopy("COPY.ENABLE_NIGHTLY_BACKUPS")}</p>
                <p className="text-xs text-secondary">{tCopy("COPY.AUTOMATICALLY_BACKS_UP_ALL_DATA_EVERY_NIGHT")}</p>
              </div>
              <Switch id="auto-backup-toggle" checked={autoBackup} onCheckedChange={setAutoBackup}  aria-label={tCopy("COPY.ENABLE_NIGHTLY_BACKUPS")} data-testid="superadmin-system-backup_configuration-switch-1"/>
            </div>

            <div className="space-y-2">
              <label htmlFor="backup-time" className="text-sm font-medium text-secondary">{tCopy("COPY.BACKUP_TIME_24HR")}</label>
              <div className="flex items-center gap-3">
                <input aria-label={tCopy("COPY.BACKUP_TIME_24HR")}
                  id="backup-time"
                  type="time"
                  value={backupTime}
                  onChange={e => setBackupTime(e.target.value)}
                  disabled={!autoBackup}
                  className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-primary focus:outline-none focus:border-focus disabled:opacity-40"
                 data-testid="superadmin-system-system-backups-backup-time-1"/>
                <span className="text-sm text-secondary">{tCopy("COPY.DAILY_AT")}{backupTime}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="retention-days" className="text-sm font-medium text-secondary">{tCopy("COPY.RETENTION_PERIOD_DAYS")}</label>
              <div className="flex items-center gap-3">
                <input aria-label={tCopy("COPY.RETENTION_PERIOD_DAYS")}
                  id="retention-days"
                  type="number"
                  step={1}
                  inputMode="numeric"
                  value={retention}
                  onChange={e => setRetention(+e.target.value)}
                  min={7}
                  max={365}
                  className="w-24 px-3 py-2 rounded-lg bg-card border border-border text-sm text-primary focus:outline-none focus:border-focus"
                 data-testid="superadmin-system-system-backups-retention-days-2"/>
                <span className="text-sm text-secondary">{tCopy("COPY.OLD_BACKUPS_DELETED_AFTER")}{retention} {tCopy("COPY.DAYS")}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button id="save-backup-schedule-btn" variant="primary" onClick={() => setOperationMessage(tCopy('COPY.BACKUP_SCHEDULE_PREVIEW_NOT_SAVED'))} data-testid="superadmin_system_backup_configuration-save-backup-schedule-btn">{tCopy("COPY.SAVE_SCHEDULE")}</Button>
          </CardFooter>
        </Card>

        {/* Cloud Sync */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud size={18} className="text-primary" /> {tCopy("COPY.CLOUD_SYNC")}</CardTitle>
            <CardDescription>{tCopy("COPY.SYNC_BACKUPS_TO_A_SECURE_CLOUD_STORAGE_DESTINATION")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
              <div>
                <p className="text-sm font-semibold text-primary">{tCopy("COPY.ENABLE_CLOUD_SYNC")}</p>
                <p className="text-xs text-secondary">{tCopy("COPY.AUTOMATICALLY_UPLOAD_BACKUPS_TO_CLOUD_AFTER_CREATION")}</p>
              </div>
              <Switch id="cloud-sync-toggle" checked={cloudSync} onCheckedChange={setCloudSync}  aria-label={tCopy("COPY.ENABLE_CLOUD_SYNC")} data-testid="superadmin-system-backup_configuration-switch-2"/>
            </div>

            {cloudSync && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary" htmlFor="superadmin-superadminsystembackupspageclient-149-select">{tCopy("COPY.CLOUD_PROVIDER")}</label>
                  <select id="superadmin-superadminsystembackupspageclient-149-select" className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm text-primary focus:outline-none focus:border-focus" data-testid="superadmin-system-system-backups-superadmin-superadminsystembackupspageclient-149-select-3">
                    {SUPERADMIN_BACKUP_PROVIDER_OPTIONS.map((provider) => <option key={provider.value} value={provider.value}>{tCopy(provider.labelKey)}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-success-bg border border-border">
                  <div className="h-8 w-8 rounded-full bg-success-bg flex items-center justify-center">
                    <Shield size={16} className="text-success" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-success">{tCopy("COPY.SAMPLE_CONFIGURATION_CONNECTION_NOT_VERIFIED")}</p>
                    <p className="text-xs text-secondary">{tCopy("COPY.SYNC_TIMESTAMP_UNAVAILABLE_IN_THIS_PREVIEW")}</p>
                  </div>
                </div>
              </>
            )}

            {/* Storage usage */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-secondary">
                <span className="flex items-center gap-1"><HardDrive size={12} /> {tCopy("COPY.LOCAL_STORAGE_USED")}</span>
                <span className="text-primary font-semibold">{tCopy("COPY.TEXT_28_4_MB_500_MB_SAMPLE")}</span>
              </div>
              <div className="h-2.5 rounded-full bg-card overflow-hidden">
                <div className="sys-storage-fill" />
              </div>
              <p className="text-xs text-secondary">{tCopy("COPY.TEXT_471_6_MB_REMAINING_ILLUSTRATIVE")}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button id="save-cloud-config-btn" variant="primary" onClick={() => setOperationMessage(tCopy('COPY.CLOUD_SETTINGS_PREVIEW_NOT_SAVED'))} data-testid="superadmin_system_backup_configuration-save-cloud-config-btn">{tCopy("COPY.SAVE_CLOUD_CONFIG")}</Button>
            <Button id="test-cloud-connection-btn" variant="ghost" onClick={() => setOperationMessage(tCopy('COPY.CLOUD_CONNECTION_TEST_UNAVAILABLE'))} data-testid="superadmin_system_backup_configuration-test-cloud-connection-btn">{tCopy("COPY.TEST_CONNECTION")}</Button>
          </CardFooter>
        </Card>
      </div>

      <SuperadminBackupConfigurationBackupHistory backups={backups} />
    </div>
  );
}
