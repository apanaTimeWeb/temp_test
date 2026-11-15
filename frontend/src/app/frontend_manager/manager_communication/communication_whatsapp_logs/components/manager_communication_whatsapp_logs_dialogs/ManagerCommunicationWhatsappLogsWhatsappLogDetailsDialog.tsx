'use client';

import { useRef } from 'react';
import { X, Smartphone, CheckCheck, Check, Clock, AlertCircle } from 'lucide-react';
import { maskManagerWhatsappLogsPhone } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/utils/ManagerCommunicationWhatsappLogsUtilities';
import { useManagerWhatsappLogsDialogFocus } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/hooks/ManagerCommunicationWhatsappLogsDialogFocus';
import type { ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialogProps } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/types/ManagerCommunicationWhatsappLogsComponentTypes';

export function ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialog({
  log,
  typeLabel,
  statusLabel,
  typeClassName,
  statusClassName,
  onClose,
  labels,
}: ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useManagerWhatsappLogsDialogFocus(dialogRef, onClose, Boolean(log));
  if (!log) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl space-y-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manager-wa-log-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
              <Smartphone size={18} />
            </div>
            <div>
              <h2 id="manager-wa-log-title" className="text-base font-bold text-primary">
                {labels.messageDetails}
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Log Audit Record #{log.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
            aria-label={labels.close}
          >
            <X size={16} />
          </button>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${typeClassName}`}>
            {typeLabel}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusClassName}`}>
            {statusLabel}
          </span>
        </div>

        {/* Details Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-surface/60 border border-border">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary block">
              {labels.student}
            </span>
            <p className="text-xs sm:text-sm font-bold text-primary mt-0.5 truncate">
              {log.student}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary block">
              {labels.to}
            </span>
            <p className="text-xs sm:text-sm font-mono font-medium text-primary mt-0.5">
              {maskManagerWhatsappLogsPhone(log.phone)}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary block">
              {labels.sentAt}
            </span>
            <p className="text-xs font-medium text-secondary mt-0.5">
              {log.dateTime}
            </p>
          </div>
        </div>

        {/* Message WhatsApp Bubble View */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-primary uppercase tracking-wider block">
            {labels.messageContent}
          </label>
          <div className="rounded-xl border border-border bg-[#0b141a] p-3.5 sm:p-4">
            <div className="max-w-md ml-auto bg-[#005c4b] text-slate-100 p-3.5 rounded-2xl rounded-tr-xs shadow-md space-y-1.5 border border-[#005c4b]/50">
              <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed select-text font-normal">
                {log.message}
              </p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200/80 pt-0.5">
                <span>{log.dateTime.slice(-8)}</span>
                {log.status === 'Delivered' ? (
                  <CheckCheck size={14} className="text-[#53bdeb]" />
                ) : log.status === 'Sent' ? (
                  <Check size={14} className="text-slate-300" />
                ) : (
                  <Clock size={12} className="text-amber-300" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Callout if any */}
        {log.error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5 text-xs text-rose-400">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{labels.error}:</span> {log.error}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mgr-btn-secondary text-xs sm:text-sm h-10 px-5 rounded-xl cursor-pointer"
          >
            {labels.close}
          </button>
        </div>
      </div>
    </div>
  );
}
