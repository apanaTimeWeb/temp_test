'use client';
/**
 * Responsibility: Render and edit Global Data Retention, Compliance and Automated Backup Schedules.
 * Flow: FormProvider context -> SuperadminSettingsGeneralDataRetentionCard -> dataRetention state updates.
 */
import { useFormContext } from 'react-hook-form';
import { Database, Archive, Calendar, Trash2, ShieldCheck, Info } from 'lucide-react';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';
import { BACKUP_SCHEDULE_OPTIONS } from '@/app/frontend_superadmin/superadmin_settings/settings_general/constants/SuperadminSettingsGeneralConstants';

export function SuperadminSettingsGeneralDataRetentionCard() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<SuperadminSettingsFormValues>();

  const memberLogsDays = watch('dataRetention.memberLogsRetentionDays') ?? 90;
  const auditLogsYears = watch('dataRetention.auditLogsRetentionYears') ?? 3;
  const punchLogsDays = watch('dataRetention.punchLogsRetentionDays') ?? 180;
  const trashPurgeDays = watch('dataRetention.autoPurgeTrashDays') ?? 14;

  return (
    <section
      id="section-data_retention"
      aria-labelledby="heading-data-retention"
      className="sa-card p-6 flex flex-col gap-6"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-subtle text-primary">
            <Database size={22} aria-hidden="true" />
          </div>
          <div>
            <h2 id="heading-data-retention" className="text-base font-bold text-primary">
              Data Retention, Compliance & Automated Backups
            </h2>
            <p className="text-xs text-secondary">
              Configure system lifecycle retention thresholds and automatic cloud archive snapshot frequencies.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-surface-hover text-secondary">
          DPDP / GDPR Compliant
        </span>
      </div>

      <div className="p-3.5 rounded-lg bg-surface-subtle border border-border flex items-start gap-3">
        <Info className="text-primary shrink-0 mt-0.5" size={16} aria-hidden="true" />
        <p className="text-xs text-secondary leading-relaxed">
          Historical records exceeding retention thresholds are automatically moved to cold S3 Glacier storage or permanently purged according to statutory requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Member Activity Logs */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-retention-member-logs" className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <Archive size={14} aria-hidden="true" />
              Member Access Logs Retention
            </label>
            <span className="text-xs font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded">
              {memberLogsDays} Days
            </span>
          </div>
          <input
            id="settings-retention-member-logs"
            type="number"
            min={7}
            max={3650}
            {...register('dataRetention.memberLogsRetentionDays', { valueAsNumber: true })}
            className="sa-input"
            data-testid="settings-retention-member-logs-input"
          />
          <span className="text-[11px] text-secondary">
            Session tokens, IP access timestamps, and route change history.
          </span>
          {errors.dataRetention?.memberLogsRetentionDays && (
            <p className="text-xs text-danger" role="alert">
              Value must be between 7 and 3,650 days.
            </p>
          )}
        </div>

        {/* Audit Trail Logs */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-retention-audit-logs" className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <ShieldCheck size={14} aria-hidden="true" />
              SuperAdmin Audit Trail Retention
            </label>
            <span className="text-xs font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded">
              {auditLogsYears} Years
            </span>
          </div>
          <input
            id="settings-retention-audit-logs"
            type="number"
            min={1}
            max={10}
            {...register('dataRetention.auditLogsRetentionYears', { valueAsNumber: true })}
            className="sa-input"
            data-testid="settings-retention-audit-logs-input"
          />
          <span className="text-[11px] text-secondary">
            Immutable admin activity, permission grants, and configuration changes.
          </span>
          {errors.dataRetention?.auditLogsRetentionYears && (
            <p className="text-xs text-danger" role="alert">
              Audit log retention must be between 1 and 10 years.
            </p>
          )}
        </div>

        {/* Punch & Attendance Logs */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-retention-punch-logs" className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <Calendar size={14} aria-hidden="true" />
              Member Biometric & Punch Logs
            </label>
            <span className="text-xs font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded">
              {punchLogsDays} Days
            </span>
          </div>
          <input
            id="settings-retention-punch-logs"
            type="number"
            min={30}
            max={1825}
            {...register('dataRetention.punchLogsRetentionDays', { valueAsNumber: true })}
            className="sa-input"
            data-testid="settings-retention-punch-logs-input"
          />
          <span className="text-[11px] text-secondary">
            Turnstile check-in/out records, slot occupancy counters, and QR scans.
          </span>
          {errors.dataRetention?.punchLogsRetentionDays && (
            <p className="text-xs text-danger" role="alert">
              Value must be between 30 and 1,825 days.
            </p>
          )}
        </div>

        {/* Auto Purge Trash */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-retention-trash" className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <Trash2 size={14} aria-hidden="true" />
              Soft-Deleted Records Auto-Purge
            </label>
            <span className="text-xs font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded">
              {trashPurgeDays} Days
            </span>
          </div>
          <input
            id="settings-retention-trash"
            type="number"
            min={1}
            max={90}
            {...register('dataRetention.autoPurgeTrashDays', { valueAsNumber: true })}
            className="sa-input"
            data-testid="settings-retention-trash-input"
          />
          <span className="text-[11px] text-secondary">
            Days deleted members, plans, and branches remain recoverable before hard deletion.
          </span>
          {errors.dataRetention?.autoPurgeTrashDays && (
            <p className="text-xs text-danger" role="alert">
              Trash retention must be between 1 and 90 days.
            </p>
          )}
        </div>

        {/* Automated Backup Schedule */}
        <div className="flex flex-col gap-2 md:col-span-2 pt-2 border-t border-border">
          <label htmlFor="settings-retention-backup-schedule" className="text-xs font-semibold text-primary">
            Automated Database Snapshot Frequency
          </label>
          <select
            id="settings-retention-backup-schedule"
            {...register('dataRetention.autoBackupSchedule')}
            className="sa-input bg-floating"
            data-testid="settings-retention-backup-schedule-select"
          >
            {BACKUP_SCHEDULE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-secondary">
            Managed database engine automatically snapshots state, signs SHA-256 manifests, and replicates to secondary multi-region cold buckets.
          </span>
        </div>
      </div>
    </section>
  );
}
