'use client';
// RESPONSIBILITY: Renders the Default Branch and Facility Settings configuration card.
// DATA FLOW: RHF context -> SuperadminSettingsGeneralBranchDefaultsCard -> user input -> form state
import type { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Building2, Clock, Users, CheckCircle2, Calendar } from 'lucide-react';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';

export const SuperadminSettingsGeneralBranchDefaultsCard: FC = () => {
  const { register, formState: { errors } } = useFormContext<SuperadminSettingsFormValues>();

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">2. Default Branch & Facility Settings</h2>
            <p className="text-xs text-secondary">Global defaults applied automatically when new libraries and branches are provisioned.</p>
          </div>
        </div>
        <span className="rounded-full bg-surface-highlight px-3 py-1 text-xs font-semibold text-primary">
          Operations
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Default Member Capacity */}
        <div className="space-y-1.5">
          <label htmlFor="settings-branch-capacity" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary">
            <Users size={13} className="text-primary" />
            Default Branch Capacity (Patrons)
          </label>
          <input
            id="settings-branch-capacity"
            type="number"
            min={10}
            max={50000}
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
            {...register('branchDefaults.defaultMemberCapacity', { valueAsNumber: true })}
            data-testid="superadmin-settings-branch-capacity-input"
          />
          {errors.branchDefaults?.defaultMemberCapacity?.message && (
            <p className="text-xs text-danger" role="alert">{errors.branchDefaults.defaultMemberCapacity.message}</p>
          )}
        </div>

        {/* Opening Time */}
        <div className="space-y-1.5">
          <label htmlFor="settings-opening-time" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary">
            <Clock size={13} className="text-primary" />
            Standard Opening Time (24h)
          </label>
          <input
            id="settings-opening-time"
            type="time"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
            {...register('branchDefaults.openingTime')}
            data-testid="superadmin-settings-opening-time-input"
          />
        </div>

        {/* Closing Time */}
        <div className="space-y-1.5">
          <label htmlFor="settings-closing-time" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary">
            <Clock size={13} className="text-primary" />
            Standard Closing Time (24h)
          </label>
          <input
            id="settings-closing-time"
            type="time"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
            {...register('branchDefaults.closingTime')}
            data-testid="superadmin-settings-closing-time-input"
          />
        </div>

        {/* Slot Duration */}
        <div className="space-y-1.5">
          <label htmlFor="settings-slot-duration" className="text-xs font-bold uppercase tracking-wider text-secondary">
            Default Slot Duration (Minutes)
          </label>
          <select
            id="settings-slot-duration"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
            {...register('branchDefaults.slotDurationMinutes', { valueAsNumber: true })}
            data-testid="superadmin-settings-slot-duration-select"
          >
            <option value={60}>60 Minutes (1 Hour)</option>
            <option value={120}>120 Minutes (2 Hours - Standard)</option>
            <option value={240}>240 Minutes (4 Hours - Half Day)</option>
            <option value={480}>480 Minutes (8 Hours - Full Day)</option>
            <option value={720}>720 Minutes (12 Hours - Extended)</option>
          </select>
        </div>

        {/* Check-in Grace Buffer */}
        <div className="space-y-1.5">
          <label htmlFor="settings-checkin-grace" className="text-xs font-bold uppercase tracking-wider text-secondary">
            Check-In Grace Window (Minutes)
          </label>
          <input
            id="settings-checkin-grace"
            type="number"
            min={0}
            max={120}
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
            {...register('branchDefaults.checkInGraceMinutes', { valueAsNumber: true })}
            data-testid="superadmin-settings-checkin-grace-input"
          />
          <span className="text-[11px] text-secondary">Allows biometric punch 15m prior to scheduled slot</span>
        </div>

        {/* Weekend Schedule Mode */}
        <div className="space-y-1.5">
          <label htmlFor="settings-weekend-schedule" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary">
            <Calendar size={13} className="text-primary" />
            Default Weekend Operations
          </label>
          <select
            id="settings-weekend-schedule"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
            {...register('branchDefaults.weekendSchedule')}
            data-testid="superadmin-settings-weekend-schedule-select"
          >
            <option value="REGULAR">Regular Full-Day Operations</option>
            <option value="HALF_DAY">Half-Day Afternoon Shifts Only</option>
            <option value="CLOSED">Closed for Maintenance & Deep Clean</option>
          </select>
        </div>

        {/* Auto Approve Member Toggle */}
        <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between rounded-xl border border-border bg-surface-zebra p-4">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 size={16} className="text-success" /> Auto-Approve New Member Registrations
            </span>
            <p className="text-xs text-secondary">
              When enabled, prospective students registering online are activated immediately without admin desk manual verification.
            </p>
          </div>
          <input
            type="checkbox"
            id="settings-auto-approve-members"
            className="h-5 w-5 rounded-md border-border accent-primary cursor-pointer"
            {...register('branchDefaults.autoApproveMembers')}
            data-testid="superadmin-settings-auto-approve-checkbox"
          />
        </div>
      </div>
    </div>
  );
};
