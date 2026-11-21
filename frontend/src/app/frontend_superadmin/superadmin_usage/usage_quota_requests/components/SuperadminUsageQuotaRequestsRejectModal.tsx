// components/SuperadminUsageQuotaRequestsRejectModal.tsx
// RESPONSIBILITY: Modal for denying quota expansion requests with required explanation.
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { QuotaUpgradeRequestRecord } from '../types/SuperadminUsageQuotaRequestsTypes';
import {
  RejectQuotaRequestSchema,
  type RejectQuotaRequestFormValues,
} from '../schemas/SuperadminUsageQuotaRequestsSchemas';
import { useSuperadminUsageQuotaRequestsMutations } from '../hooks/useSuperadminUsageQuotaRequestsMutations';

interface SuperadminUsageQuotaRequestsRejectModalProps {
  request: QuotaUpgradeRequestRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SuperadminUsageQuotaRequestsRejectModal({
  request,
  isOpen,
  onClose,
}: SuperadminUsageQuotaRequestsRejectModalProps) {
  const { rejectRequest, isRejecting } = useSuperadminUsageQuotaRequestsMutations();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RejectQuotaRequestFormValues>({
    resolver: zodResolver(RejectQuotaRequestSchema),
    values: request
      ? {
          requestId: request.id,
          rejectionReason: '',
        }
      : undefined,
  });

  if (!isOpen || !request) return null;

  const onSubmit = async (data: RejectQuotaRequestFormValues) => {
    try {
      setFormError(null);
      await rejectRequest(data);
      reset();
      onClose();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Rejection failed. Please retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-950 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Reject Quota Request</h3>
              <p className="text-xs text-slate-400">{request.libraryName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Request Context */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Resource:</span>
            <span className="font-bold text-white">{request.resourceType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Requested:</span>
            <span className="text-rose-400 font-semibold">
              {request.requestedLimit} {request.unit}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Rejection Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <input type="hidden" {...register('requestId')} />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Reason for Denial <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              {...register('rejectionReason')}
              placeholder="e.g. Please upgrade to Enterprise Plan instead of standalone branch addon..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            {errors.rejectionReason && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.rejectionReason.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isRejecting}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRejecting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer disabled:opacity-50"
            >
              {isRejecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
