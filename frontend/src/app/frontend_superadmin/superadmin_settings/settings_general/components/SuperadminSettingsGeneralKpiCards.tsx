'use client';
/**
 * Responsibility: Renders high-level platform status KPI cards for Global Settings matching the Support Helpdesk luxury palette.
 * Data-Flow: Form watch values -> SuperadminSettingsGeneralKpiCards -> visual KPI metrics with cyber glows.
 */
import type { FC } from 'react';
import { ShieldCheck, Building2, Database, Zap, Lock, HardDrive } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';

export const SuperadminSettingsGeneralKpiCards: FC = () => {
  const { watch } = useFormContext<SuperadminSettingsFormValues>();

  const mfaEnforcement = watch('securityPolicy.mfaEnforcement') ?? 'SUPERADMIN_ONLY';
  const defaultCapacity = watch('branchDefaults.defaultMemberCapacity') ?? 500;
  const storageQuota = watch('uploadRestrictions.branchStorageQuotaGb') ?? 25;
  const auditYears = watch('dataRetention.auditLogsRetentionYears') ?? 3;
  const memberLogsDays = watch('dataRetention.memberLogsRetentionDays') ?? 90;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Global Settings Status Metrics">
      {/* Security & Access Baseline - Rose/Ruby */}
      <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1c0810]/95 via-[#1c0810]/90 to-[#2c0c1a]/80 p-5 shadow-lg shadow-rose-950/30 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-950/40">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-rose-500/10 blur-2xl motion-safe:transition-all motion-safe:duration-500 group-hover:bg-rose-500/20" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Security Baseline
          </span>
          <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-rose-500/15 border-rose-500/30 text-rose-400">
            <ShieldCheck size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-400">
          {mfaEnforcement === 'SUPERADMIN_ONLY'
            ? 'SuperAdmin MFA'
            : mfaEnforcement === 'ALL_ADMINS'
            ? 'Strict All-Admin'
            : 'MFA Standard'}
        </p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-rose-300 bg-rose-500/10 border-rose-500/25">
            <Lock size={11} /> Zero-Trust Protocol Active
          </span>
        </div>
      </div>

      {/* Branch & Capacity Limits - Amber/Gold */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 p-5 shadow-lg shadow-amber-950/30 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-950/40">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl motion-safe:transition-all motion-safe:duration-500 group-hover:bg-amber-500/20" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tenant Baseline Quota
          </span>
          <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-amber-500/15 border-amber-500/30 text-amber-400">
            <Building2 size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-400">
          {defaultCapacity} Patrons
        </p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-amber-300 bg-amber-500/10 border-amber-500/25">
            <HardDrive size={11} /> {storageQuota} GB Storage Per Branch
          </span>
        </div>
      </div>

      {/* Data Retention & Backups - Cyan/Indigo */}
      <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 p-5 shadow-lg shadow-cyan-950/30 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/40">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl motion-safe:transition-all motion-safe:duration-500 group-hover:bg-cyan-500/20" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Compliance & Snapshots
          </span>
          <div className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs bg-cyan-500/15 border-cyan-500/30 text-cyan-400">
            <Database size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-cyan-400">
          {auditYears} Years Audit
        </p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-cyan-300 bg-cyan-500/10 border-cyan-500/25">
            <Zap size={11} /> {memberLogsDays}d Logs • Daily Snapshots
          </span>
        </div>
      </div>
    </section>
  );
};
