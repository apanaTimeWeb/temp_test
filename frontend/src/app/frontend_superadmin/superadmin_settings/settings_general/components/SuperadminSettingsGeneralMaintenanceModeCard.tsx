'use client';
/**
 * Responsibility: Render and edit Global System Maintenance Mode controls and emergency bypass parameters.
 * Flow: FormProvider context -> SuperadminSettingsGeneralMaintenanceModeCard -> maintenance state updates.
 */
import { useFormContext } from 'react-hook-form';
import { ShieldAlert, AlertTriangle, KeyRound, Network, Clock } from 'lucide-react';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';

export function SuperadminSettingsGeneralMaintenanceModeCard() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<SuperadminSettingsFormValues>();

  const isMaintenanceActive = Boolean(watch('maintenance.enabled'));

  return (
    <section
      id="section-maintenance_mode"
      aria-labelledby="heading-maintenance-mode"
      className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 backdrop-blur-md shadow-xl shadow-black/40 p-6 space-y-6 hover:border-indigo-500/35 transition-all"
    >
      <div className="flex items-center justify-between border-b border-indigo-500/15 pb-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
            isMaintenanceActive
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
          }`}>
            <ShieldAlert size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 id="heading-maintenance-mode" className="text-base font-bold text-slate-100">
              5. Global Maintenance Mode & Emergency Controls
            </h2>
            <p className="text-xs text-slate-400">
              Lockout non-admin users and broadcast scheduled maintenance banners platform-wide.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-rose-500/15 border border-rose-500/30 px-3 py-1 text-xs font-semibold text-rose-300">
          Disaster Recovery
        </span>
      </div>

      {/* Emergency Alert Banner when enabled */}
      {isMaintenanceActive && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-3 shadow-lg shadow-rose-950/40"
          data-testid="settings-maintenance-active-banner"
        >
          <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={20} aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
              EMERGENCY MAINTENANCE IS CURRENTLY ACTIVE
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              All member apps and branch portals will intercept traffic with HTTP 503 Service Unavailable, displaying the notice below. Only whitelisted IPs and bypass key holders can access the platform.
            </p>
          </div>
        </div>
      )}

      {/* Maintenance Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-indigo-500/20 bg-slate-950/60">
        <div className="flex flex-col gap-1">
          <label htmlFor="settings-maintenance-toggle" className="text-sm font-bold text-slate-100 cursor-pointer">
            Enable Global Maintenance Mode
          </label>
          <span className="text-xs text-slate-400">
            Instantly switch the edge reverse proxy into maintenance intercept mode.
          </span>
        </div>
        <input
          id="settings-maintenance-toggle"
          type="checkbox"
          {...register('maintenance.enabled')}
          className="h-5 w-5 rounded-md border-rose-500/40 bg-slate-950 text-rose-500 accent-rose-500 cursor-pointer"
          data-testid="settings-maintenance-toggle-input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Maintenance Message */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="settings-maintenance-message" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Broadcast Maintenance Message <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="settings-maintenance-message"
            rows={3}
            {...register('maintenance.message')}
            placeholder="e.g. System upgrade in progress. LibraryOS services will resume shortly."
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y"
            aria-invalid={Boolean(errors.maintenance?.message)}
            aria-describedby={errors.maintenance?.message ? 'settings-maintenance-message-error' : undefined}
            data-testid="settings-maintenance-message-input"
          />
          {errors.maintenance?.message && (
            <p id="settings-maintenance-message-error" className="text-xs text-rose-400" role="alert">
              {errors.maintenance.message.message ?? 'Maintenance message is required when enabled.'}
            </p>
          )}
        </div>

        {/* Estimated Downtime */}
        <div className="flex flex-col gap-2">
          <label htmlFor="settings-maintenance-downtime" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Clock size={13} className="text-indigo-400" aria-hidden="true" />
            Estimated Downtime Display
          </label>
          <input
            id="settings-maintenance-downtime"
            type="text"
            placeholder="e.g. 45 Minutes, 2 Hours"
            {...register('maintenance.estimatedDowntime')}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            data-testid="settings-maintenance-downtime-input"
          />
        </div>

        {/* Emergency Bypass Key */}
        <div className="flex flex-col gap-2">
          <label htmlFor="settings-maintenance-bypass-key" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <KeyRound size={13} className="text-rose-400" aria-hidden="true" />
            Emergency Header Bypass Token
          </label>
          <input
            id="settings-maintenance-bypass-key"
            type="text"
            {...register('maintenance.emergencyBypassKey')}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 font-mono transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            data-testid="settings-maintenance-bypass-key-input"
          />
        </div>

        {/* Whitelisted IP Addresses */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="settings-maintenance-ips" className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Network size={13} className="text-indigo-400" aria-hidden="true" />
            Whitelisted CIDRs & IP Addresses (Comma-separated)
          </label>
          <input
            id="settings-maintenance-ips"
            type="text"
            placeholder="103.24.120.0/24, 182.74.88.10/32"
            {...register('maintenance.whitelistedIps')}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 font-mono transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            data-testid="settings-maintenance-ips-input"
          />
          <span className="text-[11px] text-slate-400">
            DevOps and SuperAdmin static IP addresses that retain uninterrupted production access during maintenance.
          </span>
        </div>
      </div>
    </section>
  );
}
