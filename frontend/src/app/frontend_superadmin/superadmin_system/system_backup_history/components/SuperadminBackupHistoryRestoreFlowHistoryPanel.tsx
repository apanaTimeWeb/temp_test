'use client';
/** Responsibility: Superadmin Backup History Panel; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminBackupHistoryRestoreFlowHistoryPanel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { CloudDownload, UploadCloud } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminBackupHistoryPanelProps } from '@/app/frontend_superadmin/superadmin_system/system_backup_history/types/SuperadminBackupHistoryRestoreFlowHistoryPanelComponentTypes';


/**
 * Performs the superadmin backup history restore flow history panel operation within backup history; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminBackupHistoryPanelProps.
 */
export default function SuperadminBackupHistoryRestoreFlowHistoryPanel({ records }: SuperadminBackupHistoryPanelProps) {
  const tCopy = useTranslations('SUPERADMIN_BACKUP');
  return (
    <div className="flex-1 overflow-y-auto p-6 motion-safe:animate-fade-in motion-reduce:animate-none flex flex-col">
      <h2 className="text-lg font-bold text-primary mb-2">{tCopy("COPY.BACKUP_ARCHIVE_LOGS")}</h2>
      <p className="text-sm text-warning mb-6" role="status">{tCopy("COPY.SAMPLE_METADATA_ONLY_NO_BACKUP_FILE_BYTES_OR_DOWNLOADABLE_ARCHIVE_IS_INCLUDED")}</p>
      <div className="flex-1 border border-border rounded-xl overflow-x-auto bg-floating">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-hover text-secondary"><tr>
            <th scope="col" className="py-3 px-4 font-semibold border-b border-border">{tCopy("COPY.FILENAME")}</th>
            <th scope="col" className="py-3 px-4 font-semibold border-b border-border">{tCopy("COPY.SIZE")}</th>
            <th scope="col" className="py-3 px-4 font-semibold border-b border-border">{tCopy("COPY.TYPE_TRIGGER")}</th>
            <th scope="col" className="py-3 px-4 font-semibold border-b border-border">{tCopy("COPY.DESTINATION")}</th>
            <th scope="col" className="py-3 px-4 font-semibold border-b border-border">{tCopy("COPY.TIMESTAMP")}</th>
            <th scope="col" className="py-3 px-4 font-semibold border-b border-border">{tCopy("COPY.ACTION")}</th>
          </tr></thead>
          <tbody className="divide-y divide-border">{records.length === 0 ? <tr><td colSpan={6} role="status" className="px-4 py-8 text-center text-secondary">{tCopy('COPY.EMPTY_HISTORY')}</td></tr> : records.map((record) => (
            <tr key={record.id} className="hover:bg-surface-hover">
              <td className="py-4 px-4 font-mono text-success text-xs">{record.name}</td>
              <td className="py-4 px-4 text-primary">{tCopy('COPY.DEMO_SIZE')}</td>
              <td className="py-4 px-4 text-primary">{tCopy(record.type === 'Manual sample' ? 'COPY.MANUAL_SAMPLE' : 'COPY.SAMPLE_NOT_SCHEDULED')}</td>
              <td className="py-4 px-4 text-secondary"><span className="inline-flex items-center gap-1.5"><UploadCloud size={14} aria-hidden="true" />{tCopy('COPY.DEMO_STORAGE')}</span></td>
              <td className="py-4 px-4 text-secondary">{tCopy('COPY.ILLUSTRATIVE_ONLY')}</td>
              <td className="py-4 px-4"><button type="button" disabled title={tCopy("COPY.UNAVAILABLE_NO_BACKUP_FILE_BYTES_OR_VERIFIED_DOWNLOAD_API_ARE_SUPPLIED")} aria-label={tCopy("COPY.DOWNLOAD_UNAVAILABLE_FOR_ARIA_LABEL", { name: record.name })} className="text-secondary opacity-60 flex items-center gap-1 px-2 py-1 rounded text-xs cursor-not-allowed" data-testid={`superadmin-backup-backup-history-unavailable-no-backup-file-bytes-or-verified-download-api-are-supplied-1-${String(record.id)}`}><CloudDownload size={12} aria-hidden="true" /> {tCopy("COPY.DOWNLOAD_UNAVAILABLE")}</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
