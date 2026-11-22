'use client';
/**
 * Responsibility: Render and edit Global Data Retention, Compliance and Automated Backup Schedules.
 * Flow: FormProvider context -> SuperadminSettingsGeneralDataRetentionCard -> dataRetention state updates.
 */
import Link from 'next/link';
import { useFormContext } from 'react-hook-form';
import { Database, Archive, Calendar, Trash2, ShieldCheck, Info, ExternalLink } from 'lucide-react';
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
      className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 backdrop-blur-md shadow-xl shadow-black/40 p-6 space-y-6 hover:border-indigo-500/35 transition-all"
    >
      <div className="flex items-center justify-between border-b border-indigo-500/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Database size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 id="heading-data-retention" className="text-base font-bold text-slate-100">
              6. Data Retention, Compliance & Automated Backups
            </h2>
            <p className="text-xs text-slate-400">
              Configure system lifecycle retention thresholds and automatic cloud archive snapshot frequencies.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/superadmin/superadmin_data/data_archive_retention"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all shadow-xs cursor-pointer no-underline"
          >
            <span>Open Data Module 14</span>
            <ExternalLink size={12} />
          </Link>
          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
            DPDP / GDPR Compliant
          </span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-indigo-500/20 flex items-start gap-3">
        <Info className="text-emerald-400 shrink-0 mt-0.5" size={16} aria-hidden="true" />
        <p className="text-xs text-slate-300 leading-relaxed">
          Historical records exceeding retention thresholds are automatically moved to cold S3 Glacier storage or permanently purged according to statutory requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Member Activity Logs */}
        <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/20 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-retention-member-logs" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Archive size={13} className="text-indigo-400" aria-hidden="true" />
              Member Access Logs Retention
            </label>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
              {memberLogsDays} Days
            </span>
          </div>
          <input maxLength={30}
            id="settings-retention-member-logs"
            type="number"
            min={7}
            max={3650}
            {...register('dataRetention.memberLogsRetentionDays', { valueAsNumber: true })}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            data-testid="settings-retention-member-logs-input"
          />
          <span className="text-[11px] text-slate-400">
            Session tokens, IP access timestamps, and route change history.
          </span>
          {errors.dataRetention?.memberLogsRetentionDays && (
            <p className="text-xs text-rose-400" role="alert">
              Value must be between 7 and 3,650 days.
            </p>
          )}
        </div>

        {/* Audit Trail Logs */}
        <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/20 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-retention-audit-logs" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" aria-hidden="true" />
              SuperAdmin Audit Trail Retention
            </label>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
              {auditLogsYears} Years
            </span>
          </div>
          <input maxLength={30}
            id="settings-retention-audit-logs"
            type="number"
            min={1}
            max={10}
            {...register('dataRetention.auditLogsRetentionYears', { valueAsNumber: true })}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            data-testid="settings-retention-audit-logs-input"
          />
          <span className="text-[11px] text-slate-400">
            Immutable admin activity, permission grants, and configuration changes.
          </span>
          {errors.dataRetention?.auditLogsRetentionYears && (
            <p className="text-xs text-rose-400" role="alert">
              Audit log retention must be between 1 and 10 years.
            </p>
          )}
        </div>

        {/* Punch & Attendance Logs */}
        <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/20 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-retention-punch-logs" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Calendar size={13} className="text-amber-400" aria-hidden="true" />
              Member Biometric & Punch Logs
            </label>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
              {punchLogsDays} Days
            </span>
          </div>
          <input maxLength={30}
            id="settings-retention-punch-logs"
            type="number"
            min={30}
            max={1825}
            {...register('dataRetention.punchLogsRetentionDays', { valueAsNumber: true })}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            data-testid="settings-retention-punch-logs-input"
          />
          <span className="text-[11px] text-slate-400">
            Turnstile check-in/out records, slot occupancy counters, and QR scans.
          </span>
          {errors.dataRetention?.punchLogsRetentionDays && (
            <p className="text-xs text-rose-400" role="alert">
              Value must be between 30 and 1,825 days.
            </p>
          )}
        </div>

        {/* Auto Purge Trash */}
        <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/20 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-retention-trash" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Trash2 size={13} className="text-rose-400" aria-hidden="true" />
              Soft-Deleted Records Auto-Purge
            </label>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
              {trashPurgeDays} Days
            </span>
          </div>
          <input maxLength={30}
            id="settings-retention-trash"
            type="number"
            min={1}
            max={90}
            {...register('dataRetention.autoPurgeTrashDays', { valueAsNumber: true })}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            data-testid="settings-retention-trash-input"
          />
          <span className="text-[11px] text-slate-400">
            Days deleted members, plans, and branches remain recoverable before hard deletion.
          </span>
          {errors.dataRetention?.autoPurgeTrashDays && (
            <p className="text-xs text-rose-400" role="alert">
              Trash retention must be between 1 and 90 days.
            </p>
          )}
        </div>

        {/* Automated Backup Schedule */}
        <div className="flex flex-col gap-2 md:col-span-2 pt-2 border-t border-indigo-500/15">
          <label htmlFor="settings-retention-backup-schedule" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Automated Database Snapshot Frequency
          </label>
          <select
            id="settings-retention-backup-schedule"
            {...register('dataRetention.autoBackupSchedule')}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            data-testid="settings-retention-backup-schedule-select"
          >
            {BACKUP_SCHEDULE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-950 text-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-400">
            Managed database engine automatically snapshots state, signs SHA-256 manifests, and replicates to secondary multi-region cold buckets.
          </span>
        </div>
      </div>
    </section>
  );
}
