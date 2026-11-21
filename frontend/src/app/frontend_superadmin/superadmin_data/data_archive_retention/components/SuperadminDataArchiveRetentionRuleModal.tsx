// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/components/SuperadminDataArchiveRetentionRuleModal.tsx
'use client';

/**
 * @file SuperadminDataArchiveRetentionRuleModal.tsx
 * @description Modal dialog for adjusting Retention Policy parameters and auto-purge intervals.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Settings, Clock, ShieldCheck } from 'lucide-react';
import type { RetentionRuleRecord } from '../types/superadmin_data_archive_retention.types';
import {
  UpdateRetentionRuleSchema,
  type UpdateRetentionRuleFormData,
} from '../schemas/superadmin_data_archive_retention.schemas';

interface RuleModalProps {
  isOpen: boolean;
  rule: RetentionRuleRecord | null;
  onClose: () => void;
  onSave: (data: UpdateRetentionRuleFormData) => void;
  isSaving: boolean;
}

export function SuperadminDataArchiveRetentionRuleModal({
  isOpen,
  rule,
  onClose,
  onSave,
  isSaving,
}: RuleModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateRetentionRuleFormData>({
    resolver: zodResolver(UpdateRetentionRuleSchema),
    defaultValues: {
      ruleId: rule?.id ?? '',
      retentionPeriodDays: rule?.retentionPeriodDays ?? 365,
      postRetentionAction: rule?.postRetentionAction ?? 'ARCHIVE_TO_COLD_STORAGE',
      targetStorageTier: rule?.targetStorageTier ?? 'COLD_GLACIER_VAULT',
      isEnabled: rule?.isEnabled ?? true,
    },
  });

  React.useEffect(() => {
    if (rule) {
      reset({
        ruleId: rule.id,
        retentionPeriodDays: rule.retentionPeriodDays,
        postRetentionAction: rule.postRetentionAction,
        targetStorageTier: rule.targetStorageTier,
        isEnabled: rule.isEnabled,
      });
    }
  }, [rule, reset]);

  if (!isOpen || !rule) return null;

  const currentDays = watch('retentionPeriodDays');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rule-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 id="rule-modal-title" className="text-base font-semibold text-slate-900 dark:text-white">
                Configure Retention Policy
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {rule.entityType}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSave)} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Retention Duration (Days) *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                {...register('retentionPeriodDays', { valueAsNumber: true })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-xs font-medium text-slate-500 shrink-0 font-mono">
                (~{(currentDays / 365).toFixed(1)} years)
              </span>
            </div>
            {errors.retentionPeriodDays && (
              <span className="text-[11px] text-rose-500 mt-0.5 block">
                {errors.retentionPeriodDays.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Post-Retention Action *
            </label>
            <select
              {...register('postRetentionAction')}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="ARCHIVE_TO_COLD_STORAGE">Archive to Cold Storage (Safe)</option>
              <option value="HARD_PURGE">Hard Purge / Permanent Deletion</option>
              <option value="LEGAL_HOLD">Enforce Statutory Legal Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Target Storage Tier *
            </label>
            <select
              {...register('targetStorageTier')}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="COLD_GLACIER_VAULT">Cold Glacier Vault (Lowest Cost)</option>
              <option value="WARM_S3_STANDARD">Warm S3 Standard (Fast Retrieval)</option>
              <option value="HOT_POSTGRES">Hot PostgreSQL Database</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Automated Policy Execution
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Auto-purge and archive runs according to defined scheduler cron
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={watch('isEnabled')}
              onClick={() => setValue('isEnabled', !watch('isEnabled'), { shouldDirty: true })}
              className={`relative flex items-center w-[58px] h-[28px] p-[2px] rounded-full border-0 cursor-pointer box-border transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                watch('isEnabled')
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.45),inset_0_1px_2px_rgba(0,0,0,0.25)]'
                  : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div
                className={`pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-300 ${
                  watch('isEnabled')
                    ? 'bg-gradient-to-r from-emerald-300 to-teal-200 opacity-70 shadow-[0_0_4px_rgba(16,185,129,0.8)]'
                    : 'bg-slate-950/80 opacity-40'
                }`}
              />
              <span
                aria-hidden="true"
                className={`relative z-10 flex items-center justify-center w-[24px] h-[24px] min-w-[24px] min-h-[24px] rounded-full bg-white transition-transform duration-300 ease-out select-none shadow-[0_2px_6px_rgba(0,0,0,0.5),0_1px_2px_rgba(255,255,255,0.8)_inset] ${
                  watch('isEnabled')
                    ? 'translate-x-[30px] text-emerald-600'
                    : 'translate-x-0 text-slate-800'
                }`}
              >
                <span className="text-[11px] leading-none select-none font-bold">⏻</span>
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {isSaving ? 'Updating Policy...' : 'Save Retention Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
