// components/SuperadminDataOverviewQuickBackupModal.tsx
// RESPONSIBILITY: Renders the RHF v7 + Zod modal for triggering instant recovery snapshots. Closes on success.
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, ShieldAlert, Play, Loader2 } from 'lucide-react';
import {
  SuperadminDataQuickBackupPayloadSchema,
  type SuperadminDataQuickBackupPayload,
} from '@/app/frontend_superadmin/superadmin_data/data_overview/schemas/superadmin_data_overview.schemas';

interface SuperadminDataOverviewQuickBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: SuperadminDataQuickBackupPayload) => void;
  isSubmitting: boolean;
}

export function SuperadminDataOverviewQuickBackupModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: SuperadminDataOverviewQuickBackupModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SuperadminDataQuickBackupPayload>({
    resolver: zodResolver(SuperadminDataQuickBackupPayloadSchema),
    defaultValues: {
      snapshotName: `instant-snap-${new Date().toISOString().slice(0, 10)}`,
      backupType: 'FULL_PLATFORM',
      encryptionMode: 'AES_256_GCM',
      dualRegionSync: true,
      reason: 'Manual pre-deployment disaster recovery baseline',
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = (data: SuperadminDataQuickBackupPayload) => {
    onSubmit(data);
  };

  const handleModalClose = () => {
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-backup-title"
      data-testid="data_overview-quick-backup-modal"
    >
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-neutral-900/40">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
              <ShieldAlert size={16} />
            </span>
            <span id="quick-backup-title">Trigger Immediate Disaster Recovery Snapshot</span>
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

        {/* ── Modal Form ── */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-foreground mb-1">Snapshot Identifier</label>
            <input maxLength={100}
              type="text"
              {...register('snapshotName')}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-border text-foreground focus:outline-none focus:border-pink-500 font-mono text-xs"
              placeholder="e.g. manual-prod-snap-2026"
            />
            {errors.snapshotName && (
              <span className="text-rose-400 text-[11px] mt-1 block">{errors.snapshotName.message}</span>
            )}
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Backup Scope</label>
            <select
              {...register('backupType')}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-border text-foreground focus:outline-none focus:border-pink-500 text-xs"
            >
              <option value="FULL_PLATFORM">Full Platform (Database + Storage + WAL Logs)</option>
              <option value="TENANT_DATABASE_ONLY">Tenant Database Only (PostgreSQL Schema & Data)</option>
              <option value="BLOB_STORAGE_ONLY">Binary Blob Storage Only (PDFs, Images, Documents)</option>
            </select>
          </div>

          <div className="p-3 rounded-lg bg-neutral-900/60 border border-border/60 flex items-center justify-between">
            <div>
              <div className="font-semibold text-foreground">Dual-Region Cross Cloud Replication</div>
              <div className="text-[11px] text-muted-foreground">AWS us-east-1 + Cloudflare R2 eu-central</div>
            </div>
            <input
              type="checkbox"
              {...register('dualRegionSync')}
              className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Audit Reason / Change Memo</label>
            <textarea maxLength={1000}
              rows={2}
              {...register('reason')}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-border text-foreground focus:outline-none focus:border-pink-500 text-xs"
              placeholder="Reason for triggering on-demand snapshot"
            />
            {errors.reason && (
              <span className="text-rose-400 text-[11px] mt-1 block">{errors.reason.message}</span>
            )}
          </div>

          <div className="text-[11px] text-muted-foreground">
            Encryption: <span className="text-pink-400 font-mono">AES-256-GCM Hardware-Accelerated</span>. RPO drift resets to zero on completion.
          </div>

          {/* ── Actions ── */}
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-pink-600 hover:bg-pink-700 text-white transition-colors disabled:opacity-50 min-w-32 justify-center cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play size={13} />
                  <span>Execute Snapshot</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
