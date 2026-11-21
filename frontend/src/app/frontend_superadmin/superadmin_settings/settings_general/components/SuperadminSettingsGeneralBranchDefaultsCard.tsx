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
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 backdrop-blur-md shadow-xl shadow-black/40 p-6 space-y-6 hover:border-indigo-500/35 transition-all">
      <div className="flex items-center justify-between border-b border-indigo-500/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">2. Default Branch & Facility Settings</h2>
            <p className="text-xs text-slate-400">Global defaults applied automatically when new libraries and branches are provisioned.</p>
          </div>
        </div>
        <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-300">
          Operations
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Default Member Capacity */}
        <div className="space-y-1.5">
          <label htmlFor="settings-branch-capacity" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Users size={13} className="text-amber-400" />
            Default Branch Capacity (Patrons)
          </label>
          <input
            id="settings-branch-capacity"
            type="number"
            min={10}
            max={50000}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            {...register('branchDefaults.defaultMemberCapacity', { valueAsNumber: true })}
            data-testid="superadmin-settings-branch-capacity-input"
          />
          {errors.branchDefaults?.defaultMemberCapacity?.message && (
            <p className="text-xs text-rose-400" role="alert">{errors.branchDefaults.defaultMemberCapacity.message}</p>
          )}
        </div>

        {/* Opening Time */}
        <div className="space-y-1.5">
          <label htmlFor="settings-opening-time" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Clock size={13} className="text-amber-400" />
            Standard Opening Time (24h)
          </label>
          <input
            id="settings-opening-time"
            type="time"
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            {...register('branchDefaults.openingTime')}
            data-testid="superadmin-settings-opening-time-input"
          />
        </div>

        {/* Closing Time */}
        <div className="space-y-1.5">
          <label htmlFor="settings-closing-time" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Clock size={13} className="text-amber-400" />
            Standard Closing Time (24h)
          </label>
          <input
            id="settings-closing-time"
            type="time"
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            {...register('branchDefaults.closingTime')}
            data-testid="superadmin-settings-closing-time-input"
          />
        </div>

        {/* Slot Duration */}
        <div className="space-y-1.5">
          <label htmlFor="settings-slot-duration" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Default Slot Duration (Minutes)
          </label>
          <select
            id="settings-slot-duration"
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            {...register('branchDefaults.slotDurationMinutes', { valueAsNumber: true })}
            data-testid="superadmin-settings-slot-duration-select"
          >
            <option value={60} className="bg-slate-950 text-slate-100">60 Minutes (1 Hour)</option>
            <option value={120} className="bg-slate-950 text-slate-100">120 Minutes (2 Hours - Standard)</option>
            <option value={240} className="bg-slate-950 text-slate-100">240 Minutes (4 Hours - Half Day)</option>
            <option value={480} className="bg-slate-950 text-slate-100">480 Minutes (8 Hours - Full Day)</option>
            <option value={720} className="bg-slate-950 text-slate-100">720 Minutes (12 Hours - Extended)</option>
          </select>
        </div>

        {/* Check-in Grace Buffer */}
        <div className="space-y-1.5">
          <label htmlFor="settings-checkin-grace" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Check-In Grace Window (Minutes)
          </label>
          <input
            id="settings-checkin-grace"
            type="number"
            min={0}
            max={120}
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            {...register('branchDefaults.checkInGraceMinutes', { valueAsNumber: true })}
            data-testid="superadmin-settings-checkin-grace-input"
          />
          <span className="text-[11px] text-slate-400">Allows biometric punch 15m prior to scheduled slot</span>
        </div>

        {/* Weekend Schedule Mode */}
        <div className="space-y-1.5">
          <label htmlFor="settings-weekend-schedule" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Calendar size={13} className="text-amber-400" />
            Default Weekend Operations
          </label>
          <select
            id="settings-weekend-schedule"
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            {...register('branchDefaults.weekendSchedule')}
            data-testid="superadmin-settings-weekend-schedule-select"
          >
            <option value="REGULAR" className="bg-slate-950 text-slate-100">Regular Full-Day Operations</option>
            <option value="HALF_DAY" className="bg-slate-950 text-slate-100">Half-Day Afternoon Shifts Only</option>
            <option value="CLOSED" className="bg-slate-950 text-slate-100">Closed for Maintenance & Deep Clean</option>
          </select>
        </div>

        {/* Auto Approve Member Toggle */}
        <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between rounded-xl border border-indigo-500/20 bg-slate-950/60 p-4">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" /> Auto-Approve New Member Registrations
            </span>
            <p className="text-xs text-slate-400">
              When enabled, prospective students registering online are activated immediately without admin desk manual verification.
            </p>
          </div>
          <input
            type="checkbox"
            id="settings-auto-approve-members"
            className="h-5 w-5 rounded-md border-indigo-500/40 bg-slate-950 text-amber-500 accent-amber-500 focus:ring-amber-500/30 cursor-pointer"
            {...register('branchDefaults.autoApproveMembers')}
            data-testid="superadmin-settings-auto-approve-checkbox"
          />
        </div>
      </div>
    </div>
  );
};
