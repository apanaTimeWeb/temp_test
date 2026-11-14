'use client';
/** Responsibility: Superadmin Backup Create Panel; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminBackupOverviewCreateFlowCreatePanel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { Database, CloudUpload, HardDrive } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Performs the superadmin backup overview create flow create panel operation within backup overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminBackupOverviewCreateFlowCreatePanel() {
  const tCopy = useTranslations('SUPERADMIN_BACKUP');
  return (
    <div className="flex-1 overflow-y-auto p-6 motion-safe:animate-fade-in motion-reduce:animate-none flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">{tCopy("COPY.MANUAL_DATA_SNAPSHOT")}</h2>
          <p className="text-sm text-secondary">{tCopy("COPY.THIS_SCREEN_IS_A_UI_PREVIEW_IT_CANNOT_SNAPSHOT_OR_PROTECT_PRODUCTION_DATA")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-border bg-card rounded-2xl relative overflow-hidden">
            <Database className="text-success mb-4" size={40} aria-hidden="true" />
            <h3 className="font-bold text-primary text-lg mb-1">{tCopy("COPY.FULL_SAAS_BACKUP")}</h3>
            <p className="text-xs text-secondary leading-relaxed">{tCopy("COPY.A_REAL_FULL_PLATFORM_SNAPSHOT_REQUIRES_AN_APPROVED_BACKUP_SERVICE_AND_A_SERVER_SIDE_JOB_CONTRACT")}</p>
            <button type="button" disabled title={tCopy("COPY.UNAVAILABLE_NO_VERIFIED_BACKUP_EXECUTION_API_SERVICE_IS_SUPPLIED")} className="mt-6 text-secondary opacity-60 text-sm font-bold flex items-center gap-2 cursor-not-allowed" aria-label={tCopy("COPY.FULL_BACKUP_UNAVAILABLE")} data-testid="superadmin-backup-backup-create-unavailable-no-verified-backup-execution-api-service-is-supplied-1"><CloudUpload size={16} aria-hidden="true" /> {tCopy("COPY.FULL_BACKUP_UNAVAILABLE")}</button>
          </div>
          <div className="p-6 border border-border bg-card rounded-2xl relative overflow-hidden">
            <HardDrive className="text-info mb-4" size={40} aria-hidden="true" />
            <h3 className="font-bold text-primary text-lg mb-1">{tCopy("COPY.CONFIGURATION_SETTINGS_ONLY")}</h3>
            <p className="text-xs text-secondary leading-relaxed">{tCopy("COPY.A_SETTINGS_SNAPSHOT_REQUIRES_AN_APPROVED_BACKUP_SERVICE_AND_AN_EXPLICIT_INCLUSION_CONTRACT")}</p>
            <button type="button" disabled title={tCopy("COPY.UNAVAILABLE_NO_VERIFIED_BACKUP_EXECUTION_API_SERVICE_IS_SUPPLIED")} className="mt-6 text-secondary opacity-60 text-sm font-bold flex items-center gap-2 cursor-not-allowed" aria-label={tCopy("COPY.PARTIAL_BACKUP_UNAVAILABLE")} data-testid="superadmin-backup-backup-create-unavailable-no-verified-backup-execution-api-service-is-supplied-2"><CloudUpload size={16} aria-hidden="true" /> {tCopy("COPY.PARTIAL_BACKUP_UNAVAILABLE")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
