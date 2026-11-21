'use client';
// RESPONSIBILITY: Audience scope selection (Global vs Account-Specific) and account picker for notification compose.
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
        <label className="text-xs font-semibold text-foreground">Target Audience Scope</label>
        <div className="grid grid-cols-2 gap-3">
          <label
            className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
              selectedTargetScope === 'GLOBAL'
                ? 'border-primary bg-primary/10 text-foreground font-semibold'
                : 'border-border/60 hover:bg-muted/40 text-muted-foreground'
            }`}
          >
            <input
              type="radio"
              value="GLOBAL"
              {...register('targetScope')}
              className="sr-only"
            />
            <Globe className="w-4 h-4 text-sky-400" />
            <span className="text-xs">Global (All Libraries & Admins)</span>
          </label>

          <label
            className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
              selectedTargetScope === 'ACCOUNT_SPECIFIC'
                ? 'border-primary bg-primary/10 text-foreground font-semibold'
                : 'border-border/60 hover:bg-muted/40 text-muted-foreground'
            }`}
          >
            <input
              type="radio"
              value="ACCOUNT_SPECIFIC"
              {...register('targetScope')}
              className="sr-only"
            />
            <Building2 className="w-4 h-4 text-purple-400" />
            <span className="text-xs">Account-Specific Library</span>
          </label>
        </div>
      </div>

      {/* Account-Specific Dropdown if applicable */}
      {selectedTargetScope === 'ACCOUNT_SPECIFIC' && (
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Select Target Library Account</label>
          <select
            {...register('targetAccountId')}
            className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Choose a library account…</option>
            {accounts?.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.code}) — {acc.planName}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
