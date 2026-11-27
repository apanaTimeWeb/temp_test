// components/SuperadminDataBackupOperationsFullBackupModal.tsx
// RESPONSIBILITY: RHF v7 + Zod modal for executing an on-demand full platform disaster recovery backup. Closes on success.
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Play, Loader2, Server } from 'lucide-react';
import {
  SuperadminFullPlatformBackupRequestSchema,
  type SuperadminFullPlatformBackupFormValues,
} from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/schemas/superadmin_data_backup_operations.schemas';

interface SuperadminDataBackupOperationsFullBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SuperadminFullPlatformBackupFormValues) => void;
  isSubmitting: boolean;
}

export function SuperadminDataBackupOperationsFullBackupModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: SuperadminDataBackupOperationsFullBackupModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SuperadminFullPlatformBackupFormValues>({
    resolver: zodResolver(SuperadminFullPlatformBackupRequestSchema),
    defaultValues: {
      snapshotLabel: `full-platform-recovery-${new Date().toISOString().slice(0, 10)}`,
      scope: 'FULL_PLATFORM',
      dualCloudSync: true,
      includeAuditLogs: true,
      reason: 'Scheduled quarterly full platform disaster recovery image',
    },
  });

  if (!isOpen) return null;

  const handleModalClose = () => {
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="full-backup-modal-title"
      data-testid="data_backup-full-backup-modal"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card shadow-xl animate-in fade-in zoom-in-95 motion-safe:duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border bg-neutral-900/40">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
              <Server size={16} />
            </span>
            <span id="full-backup-modal-title">Trigger Full Platform Backup</span>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-foreground mb-1">Snapshot Label</label>
            <input maxLength={100}
              type="text"
              {...register('snapshotLabel')}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-border text-foreground font-mono text-xs focus:outline-none focus:border-pink-500"
            />
            {errors.snapshotLabel && (
              <span className="text-rose-400 text-[11px] mt-1 block">{errors.snapshotLabel.message}</span>
            )}
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Backup Scope</label>
            <select
              {...register('scope')}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-border text-foreground focus:outline-none focus:border-pink-500 text-xs"
            >
              <option value="FULL_PLATFORM">Full Platform (Database + WAL Logs + Documents)</option>
              <option value="TENANT_DATABASES">All Tenant Databases Only</option>
              <option value="BINARY_BLOBS">Binary Document Storage Only</option>
            </select>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-neutral-900/50 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-foreground">Dual-Cloud Replication Sync</div>
                <div className="text-[11px] text-muted-foreground">AWS S3 (us-east-1) + Cloudflare R2 (eu-central)</div>
              </div>
              <input type="checkbox" {...register('dualCloudSync')} className="w-4 h-4 rounded text-pink-600" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <div>
                <div className="font-semibold text-foreground">Include Full Audit Logs Trail</div>
                <div className="text-[11px] text-muted-foreground">Appends system session logs & security trails</div>
              </div>
              <input type="checkbox" {...register('includeAuditLogs')} className="w-4 h-4 rounded text-pink-600" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Audit Reason / Justification</label>
            <textarea maxLength={1000}
              rows={2}
              {...register('reason')}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-border text-foreground focus:outline-none focus:border-pink-500 text-xs"
              placeholder="State reason for initiating this full platform backup"
            />
            {errors.reason && <span className="text-rose-400 text-[11px] mt-1 block">{errors.reason.message}</span>}
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleModalClose}
              disabled={isSubmitting}
              className="px-3.5 py-2 rounded-lg font-semibold text-muted-foreground hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-pink-600 hover:bg-pink-700 text-white transition-colors disabled:opacity-50 min-w-36 justify-center cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="motion-safe:animate-spin" />
                  <span>Initiating...</span>
                </>
              ) : (
                <>
                  <Play size={13} />
                  <span>Start Full Backup</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
