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
      className="sa-card p-6 flex flex-col gap-6"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isMaintenanceActive ? 'bg-danger-subtle text-danger' : 'bg-primary-subtle text-primary'}`}>
            <ShieldAlert size={22} aria-hidden="true" />
          </div>
          <div>
            <h2 id="heading-maintenance-mode" className="text-base font-bold text-primary">
              Global Maintenance Mode & Emergency Controls
            </h2>
            <p className="text-xs text-secondary">
              Lockout non-admin users and broadcast scheduled maintenance banners platform-wide.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Alert Banner when enabled */}
      {isMaintenanceActive && (
        <div
          role="alert"
          className="p-4 rounded-lg bg-danger-subtle border border-danger flex items-start gap-3"
          data-testid="settings-maintenance-active-banner"
        >
          <AlertTriangle className="text-danger shrink-0 mt-0.5" size={20} aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-danger">
              EMERGENCY MAINTENANCE IS CURRENTLY ACTIVE
            </span>
            <p className="text-xs text-secondary">
              All member apps and branch portals will intercept traffic with HTTP 503 Service Unavailable, displaying the notice below. Only whitelisted IPs and bypass key holders can access the platform.
            </p>
          </div>
        </div>
      )}

      {/* Maintenance Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface-subtle">
        <div className="flex flex-col gap-1">
          <label htmlFor="settings-maintenance-toggle" className="text-sm font-bold text-primary cursor-pointer">
            Enable Global Maintenance Mode
          </label>
          <span className="text-xs text-secondary">
            Instantly switch the edge reverse proxy into maintenance intercept mode.
          </span>
        </div>
        <input
          id="settings-maintenance-toggle"
          type="checkbox"
          {...register('maintenance.enabled')}
          className="h-5 w-5 rounded accent-danger cursor-pointer"
          data-testid="settings-maintenance-toggle-input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Maintenance Message */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="settings-maintenance-message" className="text-xs font-semibold text-primary">
            Broadcast Maintenance Message <span className="text-danger">*</span>
          </label>
          <textarea
            id="settings-maintenance-message"
            rows={3}
            {...register('maintenance.message')}
            placeholder="e.g. System upgrade in progress. LibraryOS services will resume shortly."
            className="sa-input resize-y"
            aria-invalid={Boolean(errors.maintenance?.message)}
            aria-describedby={errors.maintenance?.message ? 'settings-maintenance-message-error' : undefined}
            data-testid="settings-maintenance-message-input"
          />
          {errors.maintenance?.message && (
            <p id="settings-maintenance-message-error" className="text-xs text-danger" role="alert">
              {errors.maintenance.message.message ?? 'Maintenance message is required when enabled.'}
            </p>
          )}
        </div>

        {/* Estimated Downtime */}
        <div className="flex flex-col gap-2">
          <label htmlFor="settings-maintenance-downtime" className="text-xs font-semibold text-primary flex items-center gap-1.5">
            <Clock size={14} aria-hidden="true" />
            Estimated Downtime Display
          </label>
          <input
            id="settings-maintenance-downtime"
            type="text"
            placeholder="e.g. 45 Minutes, 2 Hours"
            {...register('maintenance.estimatedDowntime')}
            className="sa-input"
            data-testid="settings-maintenance-downtime-input"
          />
        </div>

        {/* Emergency Bypass Key */}
        <div className="flex flex-col gap-2">
          <label htmlFor="settings-maintenance-bypass-key" className="text-xs font-semibold text-primary flex items-center gap-1.5">
            <KeyRound size={14} aria-hidden="true" />
            Emergency Header Bypass Token
          </label>
          <input
            id="settings-maintenance-bypass-key"
            type="text"
            {...register('maintenance.emergencyBypassKey')}
            className="sa-input font-mono text-xs"
            data-testid="settings-maintenance-bypass-key-input"
          />
        </div>

        {/* Whitelisted IP Addresses */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="settings-maintenance-ips" className="text-xs font-semibold text-primary flex items-center gap-1.5">
            <Network size={14} aria-hidden="true" />
            Whitelisted CIDRs & IP Addresses (Comma-separated)
          </label>
          <input
            id="settings-maintenance-ips"
            type="text"
            placeholder="103.24.120.0/24, 182.74.88.10/32"
            {...register('maintenance.whitelistedIps')}
            className="sa-input font-mono text-xs"
            data-testid="settings-maintenance-ips-input"
          />
          <span className="text-[11px] text-secondary">
            DevOps and SuperAdmin static IP addresses that retain uninterrupted production access during maintenance.
          </span>
        </div>
      </div>
    </section>
  );
}
