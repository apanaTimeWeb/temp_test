// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/components/SuperadminDataRestoreOperationsRestoreModal.tsx
'use client';

/**
 * @file SuperadminDataRestoreOperationsRestoreModal.tsx
 * @description High-security Double-Verification Restore Modal requiring explicit
 * confirmation string "CONFIRM-RESTORE" and business justification.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertOctagon, X, RotateCcw, ShieldCheck } from 'lucide-react';
import type { BackupSnapshotRecord } from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/types/superadmin_data_restore_operations.types';
import {
  RestoreExecutionSchema,
  type RestoreExecutionFormData,
} from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/schemas/superadmin_data_restore_operations.schemas';
import { RESTORE_TYPE_CONFIRM_KEY } from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/constants/superadmin_data_restore_operations.constants';
import { formatBytes, formatTimestamp } from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/utils/superadmin_data_restore_operations_formatters';

interface RestoreModalProps {
  isOpen: boolean;
  snapshot: BackupSnapshotRecord | null;
  onClose: () => void;
  onConfirm: (data: RestoreExecutionFormData) => void;
  isSubmitting: boolean;
}

export function SuperadminDataRestoreOperationsRestoreModal({
  isOpen,
  snapshot,
  onClose,
  onConfirm,
  isSubmitting,
}: RestoreModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<RestoreExecutionFormData>({
    resolver: zodResolver(RestoreExecutionSchema),
    mode: 'onChange',
    defaultValues: {
      snapshotId: snapshot?.id ?? '',
      targetType: snapshot?.scope === 'TENANT_ISOLATED' ? 'SPECIFIC_TENANT' : 'FULL_PLATFORM',
      targetTenantId: snapshot?.tenantId ?? null,
      reason: '',
      confirmationText: undefined,
    },
  });

  React.useEffect(() => {
    if (snapshot) {
      reset({
        snapshotId: snapshot.id,
        targetType: snapshot.scope === 'TENANT_ISOLATED' ? 'SPECIFIC_TENANT' : 'FULL_PLATFORM',
        targetTenantId: snapshot.tenantId ?? null,
        reason: '',
        confirmationText: undefined,
      });
    }
  }, [snapshot, reset]);

  if (!isOpen || !snapshot) return null;

  const confirmationValue = watch('confirmationText');
  const isMatch = confirmationValue === RESTORE_TYPE_CONFIRM_KEY;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="restore-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-rose-100 dark:border-rose-950/40 bg-rose-50/50 dark:bg-rose-950/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h2 id="restore-modal-title" className="text-base font-semibold text-rose-900 dark:text-rose-200">
                Authorize Point-in-Time Restore
              </h2>
              <p className="text-xs text-rose-600 dark:text-rose-400">
                High-Impact Recovery Action (Audit Logged)
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

        {/* Snapshot Summary Box */}
        <div className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Target Snapshot:</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">
                {snapshot.snapshotNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scope / Target:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {snapshot.scope === 'TENANT_ISOLATED'
                  ? `Isolated: ${snapshot.tenantName ?? 'Tenant'}`
                  : 'Full Platform'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Snapshot Timestamp:</span>
              <span className="text-slate-700 dark:text-slate-300">
                {formatTimestamp(snapshot.createdAt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Archive Size:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {formatBytes(snapshot.sizeBytes)}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onConfirm)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Disaster Recovery Justification / Audit Reason *
              </label>
              <textarea maxLength={1000}
                {...register('reason')}
                rows={2}
                placeholder="Explain the necessity for this restore (e.g. database corruption recovery or audited rollback)..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
              {errors.reason && (
                <span className="text-[11px] text-rose-500 mt-0.5 block">{errors.reason.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Type <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{RESTORE_TYPE_CONFIRM_KEY}</span> to confirm *
              </label>
              <input maxLength={30}
                type="text"
                {...register('confirmationText')}
                placeholder={RESTORE_TYPE_CONFIRM_KEY}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
              {errors.confirmationText && (
                <span className="text-[11px] text-rose-500 mt-0.5 block">
                  {errors.confirmationText.message}
                </span>
              )}
            </div>

            {/* Tenant Isolation Reassurance */}
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-[11px]">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Multi-Tenant Quarantine verified: zero collateral impact on sibling tenants.</span>
            </div>

            {/* Footer buttons */}
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
                disabled={!isMatch || !isValid || isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isSubmitting ? 'Authorizing Restore...' : 'Authorize & Execute Restore'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
