'use client';
/** Responsibility: Superadmin Backup Restore Panel; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminBackupOverviewRestorePanel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Performs the superadmin backup overview restore panel operation within backup overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminBackupOverviewRestorePanel() {
  const tCopy = useTranslations('SUPERADMIN_BACKUP');
  return (
    <div className="flex-1 overflow-y-auto p-6 motion-safe:animate-fade-in motion-reduce:animate-none flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-warning-bg border border-border p-8 rounded-2xl text-center">
        <RotateCcw size={48} className="text-warning mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-primary mb-2">{tCopy("COPY.RESTORE_PLATFORM_FROM_BACKUP")}</h2>
        <p className="text-sm text-secondary mb-4 leading-relaxed">{tCopy("COPY.RESTORING_A_BACKUP_IS_DESTRUCTIVE_THIS_SOURCE_SLICE_CONTAINS_NO_BACKUP_BYTES_APPROVED_RESTORE_ENDPOINT_ARCHIVE_IDENTITY_CONTRACT_OR_SERVER_SIDE_RECOVERY_CONFIRMATION_CONTRACT")}</p>
        <p className="text-sm text-warning mb-6 flex items-center justify-center gap-2" role="status"><AlertTriangle size={16} aria-hidden="true" /> {tCopy("COPY.RESTORE_IS_UNAVAILABLE_NO_DATA_WILL_BE_MODIFIED_OR_OVERWRITTEN")}</p>
        <button type="button" disabled title={tCopy("COPY.UNAVAILABLE_APPROVED_RESTORE_API_ARCHIVE_IDENTITY_AND_RECOVERY_CONTRACT_ARE_REQUIRED")} className="sa-btn-primary bg-danger text-on-danger border-none px-8 py-3 text-lg opacity-60 cursor-not-allowed" data-testid="superadmin-backup-backup-restore-unavailable-approved-restore-api-archive-identity-and-recovery-contract-are-required-1">{tCopy("COPY.RESTORE_UNAVAILABLE_NO_SERVER_OPERATION")}</button>
      </div>
    </div>
  );
}
