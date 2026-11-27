'use client';

import type { ManagerCommunicationNotificationCenterNotificationHistoryRow } from '@/app/frontend_manager/manager_communication/communication_notification_center/hooks/ManagerCommunicationNotificationCenterDemoRepository';
import { Copy, Mail, MessageSquare, Printer, Send, Smartphone, X } from 'lucide-react';
import { toast } from 'sonner';

interface ManagerCommunicationNotificationCenterHistoryInspectModalProps {
  row: ManagerCommunicationNotificationCenterNotificationHistoryRow;
  onClose: () => void;
  onResend: (row: ManagerCommunicationNotificationCenterNotificationHistoryRow) => void;
}

/** Modal slip preview for inspecting and re-dispatching a notification history record. */
export function ManagerCommunicationNotificationCenterHistoryInspectModal({
  row,
  onClose,
  onResend,
}: ManagerCommunicationNotificationCenterHistoryInspectModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-sm motion-safe:animate-fade-in"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-subtle text-primary border border-border">
                Dispatch Log #{row.id}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  row.status === 'Delivered'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}
              >
                {row.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-primary">Notification Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer motion-safe:transition-colors"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-surface border border-border">
            <div>
              <span className="text-[11px] text-secondary font-semibold">Recipient</span>
              <p className="font-bold text-primary mt-0.5">{row.recipient}</p>
            </div>
            <div>
              <span className="text-[11px] text-secondary font-semibold">Channel</span>
              <p className="font-bold text-primary mt-0.5 flex items-center gap-1.5">
                {row.channel === 'WhatsApp' && <Smartphone size={13} className="text-emerald-400" />}
                {row.channel === 'SMS' && <MessageSquare size={13} className="text-amber-400" />}
                {row.channel === 'Email' && <Mail size={13} className="text-sky-400" />}
                <span>{row.channel}</span>
              </p>
            </div>
            <div>
              <span className="text-[11px] text-secondary font-semibold">Message Type</span>
              <p className="font-medium text-secondary mt-0.5">{row.type}</p>
            </div>
            <div>
              <span className="text-[11px] text-secondary font-semibold">Timestamp</span>
              <p className="font-mono text-secondary mt-0.5">{row.date}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5">
            <span className="text-[11px] font-semibold text-secondary">Dispatched Message Body</span>
            <p className="text-xs sm:text-sm text-primary leading-relaxed bg-card p-3 rounded-lg border border-border font-mono">
              {`Hello ${row.recipient.split(' ')[0]}, your library ${row.type.toLowerCase()} notice has been recorded in the system. Ref #${row.id} on ${row.date}.`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  `Recipient: ${row.recipient}\nType: ${row.type}\nChannel: ${row.channel}\nDate: ${row.date}\nStatus: ${row.status}`
                );
                toast.success('Notification summary copied to clipboard', { id: 'manager-notif-history-copy' });
              }}
              className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
            >
              <Copy size={12} />
              <span>Copy</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer"
            >
              <Printer size={12} />
              <span>Print Slip</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onResend(row)}
            className="mgr-btn-primary inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-95 motion-safe:transition-all cursor-pointer shadow-xs"
          >
            <Send size={12} />
            <span>Resend Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
