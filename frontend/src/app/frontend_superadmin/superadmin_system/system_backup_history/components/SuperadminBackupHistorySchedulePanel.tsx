'use client';
import { SUPERADMIN_BACKUP_RETENTION_OPTIONS } from '@/app/frontend_superadmin/superadmin_system/system_backup_history/constants/SuperadminBackupHistoryConstants';
/** Responsibility: Superadmin Backup Schedule Panel; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminBackupHistorySchedulePanel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { CloudRain, Database, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminBackupHistorySchedulePreview } from '@/app/frontend_superadmin/superadmin_system/system_backup_history/hooks/useSuperadminBackupHistorySchedulePreview';
import type { SuperadminBackupSchedulePanelProps } from '@/app/frontend_superadmin/superadmin_system/system_backup_history/types/SuperadminBackupHistorySchedulePanelComponentTypes';


/**
 * Performs the superadmin backup history schedule panel operation within backup history; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminBackupSchedulePanelProps.
 */
export default function SuperadminBackupHistorySchedulePanel({ onPreviewNotice }: SuperadminBackupSchedulePanelProps) {
  const tCopy = useTranslations('SUPERADMIN_BACKUP');
  const { retention, setRetention, preview, previewSchedule } = useSuperadminBackupHistorySchedulePreview(onPreviewNotice);

  return (
    <div className="flex-1 overflow-y-auto p-6 motion-safe:animate-fade-in motion-reduce:animate-none max-w-3xl">
      <h2 className="text-lg font-bold text-primary mb-2">{tCopy("COPY.AUTOMATED_BACKUP_RULES")}</h2>
      <p className="text-sm text-secondary mb-8">{tCopy("COPY.SAMPLE_SCHEDULE_PREVIEW_ONLY_SCHEDULER_AND_STORAGE_INTEGRATION_ARE_NOT_CONNECTED_AUTOMATION_SWITCHES_ARE_DISABLED")}</p>
      <div className="space-y-6">
        <div className="p-5 bg-surface-hover border border-border rounded-2xl flex items-center justify-between gap-4">
          <div><h3 className="font-bold text-primary flex items-center gap-2"><Database size={16} className="text-success" aria-hidden="true" />{tCopy("COPY.DAILY_FULL_DATABASE_DUMP")}</h3><p className="text-xs text-secondary mt-1">{tCopy("COPY.ILLUSTRATIVE_SCHEDULE_ONLY_NOT_CONFIGURED_ON_A_SERVER")}</p></div>
          <label className="sa-toggle"><input type="checkbox" defaultChecked disabled aria-label={tCopy("COPY.SAMPLE_FULL_DUMP_SCHEDULE_STATE_NOT_EDITABLE")}  data-testid="superadmin-backup-backup-schedule-sample-full-dump-schedule-state-not-editable-1"/><span className="sa-slider" /></label>
        </div>
        <div className="p-5 bg-surface-hover border border-border rounded-2xl flex items-center justify-between gap-4">
          <div><h3 className="font-bold text-primary flex items-center gap-2"><CloudRain size={16} className="text-info" aria-hidden="true" />{tCopy("COPY.AWS_S3_OFFSITE_SYNC")}</h3><p className="text-xs text-secondary mt-1">{tCopy("COPY.SAMPLE_DESTINATION_ONLY_NO_STORAGE_CONNECTION_IS_CONFIGURED")}</p></div>
          <label className="sa-toggle"><input type="checkbox" defaultChecked disabled aria-label={tCopy("COPY.SAMPLE_CLOUD_SYNC_STATE_NOT_EDITABLE")}  data-testid="superadmin-backup-backup-schedule-sample-cloud-sync-state-not-editable-2"/><span className="sa-slider" /></label>
        </div>
        <div className="p-5 bg-surface-hover border border-border rounded-2xl">
          <label className="text-sm font-semibold text-primary block mb-2" htmlFor="superadmin-backup-schedule-retention">{tCopy("COPY.RETENTION_POLICY_PREVIEW_ONLY")}</label>
          <select id="superadmin-backup-schedule-retention" value={retention} onChange={(event) => setRetention(event.target.value)} className="sa-input bg-floating" data-testid="superadmin-backup-backup-schedule-superadmin-backup-schedule-retention-3">
{SUPERADMIN_BACKUP_RETENTION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{tCopy(option.labelKey)}</option>)}
          </select>
        </div>
        <div className="pt-4 flex flex-col items-start gap-3">
          <button type="button" className="sa-btn-primary" onClick={previewSchedule} data-testid="superadmin-backup-backup-schedule-preview-schedule-selection-4"><Save size={16} aria-hidden="true" />{tCopy("COPY.PREVIEW_SCHEDULE_SELECTION")}</button>
          {preview && <p className="rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{preview}</p>}
        </div>
      </div>
    </div>
  );
}
