'use client';
// RESPONSIBILITY: Audience scope selection (Global vs Account-Specific) and account picker for notification compose in Cyber-Luxury styling.
// FLOW: ComposeModal -> ComposeScopeSelector -> form registration.

import { Globe, Building2 } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';
import type { DispatchNotificationSchema } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/schemas/SuperadminCommunicationNotificationCenterSchemas';
import type {
  NotificationTargetAccount,
  NotificationTargetScope,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

interface ComposeScopeSelectorProps {
  selectedTargetScope: NotificationTargetScope;
  accounts?: NotificationTargetAccount[];
  register: UseFormRegister<DispatchNotificationSchema>;
}

export function SuperadminCommunicationNotificationCenterComposeScopeSelector({
  selectedTargetScope,
  accounts,
  register,
}: ComposeScopeSelectorProps) {
  return (
    <div className="space-y-3">
      {/* Target Scope Selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-200">Target Audience Scope</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            className={`p-3.5 rounded-xl border flex items-center gap-2.5 cursor-pointer motion-safe:transition-all ${
              selectedTargetScope === 'GLOBAL'
                ? 'border-indigo-500 bg-indigo-500/15 text-white font-semibold shadow-inner shadow-indigo-500/20'
                : 'border-indigo-500/20 bg-slate-950/60 hover:bg-slate-900/60 text-slate-400'
            }`}
          >
            <input
              type="radio"
              value="GLOBAL"
              {...register('targetScope')}
              className="sr-only"
            />
            <Globe className="w-4 h-4 text-sky-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs block">Global Broadcast</span>
              <span className="text-2xs text-slate-400 block">All Libraries, Admins & Staff</span>
            </div>
          </label>

          <label
            className={`p-3.5 rounded-xl border flex items-center gap-2.5 cursor-pointer motion-safe:transition-all ${
              selectedTargetScope === 'ACCOUNT_SPECIFIC'
                ? 'border-indigo-500 bg-indigo-500/15 text-white font-semibold shadow-inner shadow-indigo-500/20'
                : 'border-indigo-500/20 bg-slate-950/60 hover:bg-slate-900/60 text-slate-400'
            }`}
          >
            <input
              type="radio"
              value="ACCOUNT_SPECIFIC"
              {...register('targetScope')}
              className="sr-only"
            />
            <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs block">Account-Specific</span>
              <span className="text-2xs text-slate-400 block">Target a single library entity</span>
            </div>
          </label>
        </div>
      </div>

      {/* Account-Specific Dropdown if applicable */}
      {selectedTargetScope === 'ACCOUNT_SPECIFIC' && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200">Select Target Library Account</label>
          <select
            {...register('targetAccountId')}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-xs text-slate-100 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 cursor-pointer shadow-inner"
          >
            <option value="" className="bg-slate-900 text-slate-400">Choose a library account…</option>
            {accounts?.map((acc) => (
              <option key={acc.id} value={acc.id} className="bg-slate-900 text-slate-100">
                {acc.name} ({acc.code}) — {acc.planName}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
