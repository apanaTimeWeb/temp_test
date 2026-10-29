'use client';
// RESPONSIBILITY: Render the feature dialog/modal and its local interaction boundary for components. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Render the feature dialog/modal and its local interaction boundary for components. It does not own backend persistence or cross-feature business logic.
import { useRef } from 'react';
import { X } from 'lucide-react';
import { maskManagerWhatsappLogsPhone } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/utils/ManagerCommunicationWhatsappLogsUtilities';
import { useManagerWhatsappLogsDialogFocus } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/hooks/ManagerCommunicationWhatsappLogsDialogFocus';
import type { ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialogProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/types/ManagerCommunicationWhatsappLogsComponentTypes';




export function ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialog({ log, typeLabel, statusLabel, typeClassName, statusClassName, onClose, labels }: ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useManagerWhatsappLogsDialogFocus(dialogRef, onClose, Boolean(log));
  if (!log) return null;

  return (
    <div className="mc-overlay">
      <div ref={dialogRef} tabIndex={-1} className="mc-modal mc-modal--lg bg-card" role="dialog" aria-modal="true" aria-labelledby="manager-wa-log-title">
        <button type="button" onClick={onClose} className="mc-modal-close hover:text-danger" aria-label={labels.close}><X size={16} aria-hidden="true" /></button>
        <h2 id="manager-wa-log-title" className="mc-modal-title mb-4 font-bold text-primary">{labels.messageDetails}</h2>
        <div className="mc-modal-badge-row mb-6 flex gap-2">
          <span className={`mc-badge ${typeClassName}`}>{typeLabel}</span>
          <span className={`mc-badge ${statusClassName}`}>{statusLabel}</span>
        </div>
        <div className="mc-msg-detail-grid grid grid-cols-2 gap-4 mb-6 bg-page p-4 rounded-lg">
          {([[labels.to, maskManagerWhatsappLogsPhone(log.phone)], [labels.student, log.student], [labels.sentAt, log.dateTime]] as [string, string][]).map(([key, value]) => (
            <div key={key} className="mc-msg-detail-item">
              <p className="mc-msg-detail-key text-xs font-semibold text-secondary uppercase tracking-wider">{key}</p>
              <p className="mc-msg-detail-val text-primary font-medium mt-1">{value}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="mc-label text-sm font-semibold mb-2 block">{labels.messageContent}</p>
          <div className="mc-msg-body-box bg-page p-4 rounded-lg border border-border text-sm leading-relaxed text-primary whitespace-pre-wrap">{log.message}</div>
        </div>
        {log.error && <div className="mc-warn-box mt-4 p-3 bg-danger-bg text-danger rounded-lg border border-danger text-sm font-medium">{labels.error} {log.error}</div>}
        <div className="mc-modal-footer mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-page border border-border text-primary rounded hover:bg-floating motion-safe:transition-colors">{labels.close}</button>
        </div>
      </div>
    </div>
  );
}
