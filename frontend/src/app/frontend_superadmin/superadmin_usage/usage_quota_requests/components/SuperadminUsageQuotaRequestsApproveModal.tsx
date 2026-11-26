// components/SuperadminUsageQuotaRequestsApproveModal.tsx
// RESPONSIBILITY: Modal for reviewing and approving library quota expansion requests (e.g. 4th branch).
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import type { QuotaUpgradeRequestRecord } from '@/app/frontend_superadmin/superadmin_usage/usage_quota_requests/types/SuperadminUsageQuotaRequestsTypes';
import {
  ApproveQuotaRequestSchema,
  type ApproveQuotaRequestFormValues,
} from '@/app/frontend_superadmin/superadmin_usage/usage_quota_requests/schemas/SuperadminUsageQuotaRequestsSchemas';
import { useSuperadminUsageQuotaRequestsMutations } from '@/app/frontend_superadmin/superadmin_usage/usage_quota_requests/hooks/useSuperadminUsageQuotaRequestsMutations';

interface SuperadminUsageQuotaRequestsApproveModalProps {
  request: QuotaUpgradeRequestRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SuperadminUsageQuotaRequestsApproveModal({
  request,
  isOpen,
  onClose,
}: SuperadminUsageQuotaRequestsApproveModalProps) {
  const { approveRequest, isApproving } = useSuperadminUsageQuotaRequestsMutations();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApproveQuotaRequestFormValues>({
    resolver: zodResolver(ApproveQuotaRequestSchema),
    values: request
      ? {
          requestId: request.id,
          approvedLimit: request.requestedLimit,
          addonFeeMonthlyInr: request.addonFeeMonthlyInr ?? 0,
          reviewNotes: `Approved ${request.resourceType} expansion to ${request.requestedLimit} ${request.unit} for ${request.libraryName}.`,
        }
      : undefined,
  });

  if (!isOpen || !request) return null;

  const onSubmit = async (data: ApproveQuotaRequestFormValues) => {
    try {
      setFormError(null);
      await approveRequest(data);
      reset();
      onClose();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Approval failed. Please retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in motion-safe:duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-emerald-500/30 bg-[#0a0d24] p-6 shadow-2xl shadow-emerald-950/50 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Approve Resource Quota Expansion</h3>
              <p className="text-xs text-slate-400">{request.libraryName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Request Context Card */}
        <div className="rounded-xl border border-indigo-500/20 bg-slate-950/60 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Current Plan Tier:</span>
            <span className="font-semibold text-white">{request.planName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Resource Requested:</span>
            <span className="font-bold text-sky-300">
              {request.resourceType} ({request.currentUsage} / {request.currentLimit} used)
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-indigo-500/15 pt-2">
            <span className="text-slate-400">Requested Allocation:</span>
            <span className="font-bold text-emerald-400 text-sm">
              {request.requestedLimit} {request.unit} (+{request.requestedLimit - request.currentLimit})
            </span>
          </div>
          <div className="border-t border-indigo-500/15 pt-2 text-slate-300">
            <span className="font-bold text-slate-400">Justification:</span>
            <p className="mt-0.5 text-[11px] text-slate-400 italic bg-black/40 p-2.5 rounded-xl border border-indigo-500/10">
              &quot;{request.businessJustification}&quot;
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Approval Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('requestId')} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Approved Capacity Limit ({request.unit})
              </label>
              <input maxLength={100}
                type="number"
                min={1}
                {...register('approvedLimit', { valueAsNumber: true })}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {errors.approvedLimit && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.approvedLimit.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Monthly Addon Surcharge (₹ INR)
              </label>
              <input maxLength={100}
                type="number"
                min={0}
                {...register('addonFeeMonthlyInr', { valueAsNumber: true })}
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {errors.addonFeeMonthlyInr && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.addonFeeMonthlyInr.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              SuperAdmin Approval Note
            </label>
            <textarea maxLength={1000}
              rows={2}
              {...register('reviewNotes')}
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {errors.reviewNotes && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.reviewNotes.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-indigo-500/20 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isApproving}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isApproving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold motion-safe:transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isApproving ? <Loader2 className="h-3.5 w-3.5 motion-safe:animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              Confirm Approval & Expand Quota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}