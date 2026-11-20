// components/SuperadminDataBackupOperationsScheduleModal.tsx
// RESPONSIBILITY: RHF v7 + Zod modal for creating or configuring automated backup policies. No direct API calls.
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, CalendarClock, Loader2, Plus } from 'lucide-react';
import {
  SuperadminBackupScheduleSchema,
  type SuperadminBackupScheduleFormValues,
} from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/schemas/superadmin_data_backup_operations.schemas';
import {
  SUPERADMIN_BACKUP_FREQUENCIES,
  SUPERADMIN_BACKUP_STORAGE_TARGETS,
  SUPERADMIN_BACKUP_ENCRYPTION_STANDARDS,
} from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/constants/superadmin_data_backup_operations.constants';

interface SuperadminDataBackupOperationsScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SuperadminBackupScheduleFormValues) => void;
  isSubmitting: boolean;
}

export function SuperadminDataBackupOperationsScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: SuperadminDataBackupOperationsScheduleModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<SuperadminBackupScheduleFormValues>({
    resolver: zodResolver(SuperadminBackupScheduleSchema),
    defaultValues: {
      name: '',
      frequency: 'DAILY',
      cronExpression: '0 0 * * *',
      scope: 'FULL_PLATFORM',
      storageTarget: 'DUAL_REGION',
      retentionDays: 30,
      encryptionStandard: 'AES_256_GCM',
      isActive: true,
    },
  });

  const selectedFrequency = watch('frequency');

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as 'HOURLY_WAL' | 'DAILY' | 'TWICE_DAILY' | 'WEEKLY';
    setValue('frequency', val);
    const matched = SUPERADMIN_BACKUP_FREQUENCIES.find((f) => f.value === val);
    if (matched) {
      setValue('cronExpression', matched.cron);
    }
  };

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
      aria-labelledby="schedule-modal-title"
      data-testid="data_backup-create-schedule-modal"
    >
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border bg-neutral-900/40">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
              <CalendarClock size={16} />
            </span>
            <span id="schedule-modal-title">Create Automated Backup Schedule</span>
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
            <label className="block font-semibold text-foreground mb-1">Policy / Schedule Name</label>
            <input
              type="text"
              {...register('name')}
              placeholder="e.g. Daily Tenant Database Snapshot"
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-border text-foreground focus:outline-none focus:border-pink-500 text-xs"
            />
            {errors.name && <span className="text-rose-400 text-[11px] mt-1 block">{errors.name.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-foreground mb-1">Frequency Preset</label>
              <select
                value={selectedFrequency}
                onChange={handleFrequencyChange}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-border text-foreground focus:outline-none focus:border-pink-500 text-xs"
              >
                {SUPERADMIN_BACKUP_FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Cron Expression</label>
              <input
                type="text"
                {...register('cronExpression')}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-border text-pink-400 font-mono text-xs focus:outline-none focus:border-pink-500"
              />
              {errors.cronExpression && (
                <span className="text-rose-400 text-[11px] mt-1 block">{errors.cronExpression.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-foreground mb-1">Backup Scope</label>
              <select
                {...register('scope')}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-border text-foreground focus:outline-none focus:border-pink-500 text-xs"
              >
                <option value="FULL_PLATFORM">Full Platform Recovery</option>
                <option value="TENANT_DATABASES">Tenant PostgreSQL DBs Only</option>
                <option value="BINARY_BLOBS">Binary Object Blobs Only</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Retention Window (Days)</label>
              <input
                type="number"
                {...register('retentionDays', { valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-border text-foreground focus:outline-none focus:border-pink-500 text-xs"
              />
              {errors.retentionDays && (
                <span className="text-rose-400 text-[11px] mt-1 block">{errors.retentionDays.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Target Storage Cluster</label>
            <select
              {...register('storageTarget')}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-border text-foreground focus:outline-none focus:border-pink-500 text-xs"
            >
              {SUPERADMIN_BACKUP_STORAGE_TARGETS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Encryption Standard</label>
            <select
              {...register('encryptionStandard')}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-border text-foreground focus:outline-none focus:border-pink-500 text-xs"
            >
              {SUPERADMIN_BACKUP_ENCRYPTION_STANDARDS.map((enc) => (
                <option key={enc.value} value={enc.value}>
                  {enc.label}
                </option>
              ))}
            </select>
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-pink-600 hover:bg-pink-700 text-white transition-colors disabled:opacity-50 min-w-32 justify-center cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Plus size={13} />
                  <span>Create Policy</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
