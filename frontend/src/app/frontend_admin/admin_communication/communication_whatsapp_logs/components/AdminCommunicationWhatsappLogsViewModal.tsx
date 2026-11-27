'use client';

import { ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/config/admin_communication_whatsapp_logs.url_config';
import type { AdminCommunicationWhatsappLog } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { AlertCircle, Calendar, CheckCheck, Copy, RotateCcw, Server, ShieldCheck, Smartphone, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface AdminCommunicationWhatsappLogsViewModalProps {
  viewLog: AdminCommunicationWhatsappLog | null;
  onClose: () => void;
  onCopy: (text: string) => void;
  onRetry: (id: string) => void;
}

const WHATSAPP_TYPE_ICONS: Record<string, string> = {
  welcome: '👋',
  fee_reminder: '💰',
  receipt: '🧾',
  notice: '📢',
  renewal: '🔁',
};

function getInitials(name: string): string {
  if (!name) return 'W';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AdminCommunicationWhatsappLogsViewModal({
  viewLog,
  onClose,
  onCopy,
  onRetry,
}: AdminCommunicationWhatsappLogsViewModalProps) {
  const t = useTranslations('ADMIN_COMMUNICATION');

  if (!viewLog) return null;

  const isAutoApi = viewLog.dispatchMode === 'auto_api_single';

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="relative w-full max-w-[560px] overflow-hidden rounded-3xl border border-border bg-overlay p-0 shadow-dialog text-text-primary">
        <div className="bg-success px-5 py-4 text-on-primary flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-card border border-border text-text-primary font-bold text-sm shadow-inner shrink-0">
              {getInitials(viewLog.student)}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-on-primary tracking-tight flex items-center gap-1.5 leading-none">
                <span>{viewLog.student}</span>
                <ShieldCheck size={14} className="shrink-0" />
              </DialogTitle>
              <DialogDescription className="sr-only">{t('WHATSAPP_LOG_DETAILS_DESCRIPTION')}</DialogDescription>
              <div className="mt-1 flex items-center gap-2 text-xs text-on-primary font-mono">
                <span>+91 {viewLog.phone}</span>
                {viewLog.branch && (
                  <span className="rounded-full bg-card px-2 py-0.5 font-sans text-[10px] text-text-primary border border-border">
                    {viewLog.branch}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label={t('WHATSAPP_CLOSE_DETAILS_ARIA')}
            data-testid="admin_communication-page-control-004"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-on-primary hover:opacity-80 motion-safe:transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        <div className="relative min-h-[220px] max-h-[340px] overflow-y-auto bg-surface p-5 space-y-4">
          <div className="relative flex justify-center">
            <span className="rounded-full bg-card px-3.5 py-1 text-[11px] font-medium text-text-secondary shadow-sm border border-border flex items-center gap-1.5">
              <Calendar size={12} className="text-text-secondary" />
              <span>Dispatched on {viewLog.dateTime}</span>
            </span>
          </div>

          <div className="relative ml-auto max-w-[88%] rounded-2xl rounded-tr-xs bg-success-bg border border-success p-4 text-text-primary shadow-lg space-y-2">
            <div className="whitespace-pre-wrap text-xs leading-relaxed text-text-primary font-sans select-text">
              {viewLog.message}
            </div>
            <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] font-mono text-success-text">
              <span>{viewLog.dateTime.split(' ').slice(-2).join(' ')}</span>
              {viewLog.status === 'Delivered' ? (
                <span className="text-info-text font-bold flex items-center gap-0.5" title="Delivered">
                  <CheckCheck size={13} /> Delivered
                </span>
              ) : viewLog.status === 'Sent' ? (
                <span className="text-text-secondary font-bold flex items-center gap-0.5" title="Sent">
                  <CheckCheck size={13} /> Sent
                </span>
              ) : viewLog.status === 'Failed' ? (
                <span className="text-danger-text font-bold flex items-center gap-0.5" title="Failed">
                  ✕ Delivery Failed
                </span>
              ) : (
                <span className="text-warning-text font-bold flex items-center gap-0.5" title="Pending">
                  ⏱ Queued
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-card p-5 space-y-3.5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-surface p-2.5">
              <span className="text-[10px] uppercase font-semibold text-text-secondary block">Dispatch ID</span>
              <span className="font-mono text-xs font-bold text-text-primary mt-0.5 block">#WA-LOG-00{viewLog.id}</span>
            </div>
            <div className="rounded-xl border border-border bg-surface p-2.5">
              <span className="text-[10px] uppercase font-semibold text-text-secondary block">Template</span>
              <span className="text-xs font-bold text-info-text mt-0.5 flex items-center gap-1 truncate">
                <span>{WHATSAPP_TYPE_ICONS[viewLog.type] || '📱'}</span>
                <span className="truncate">{t(ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL[viewLog.type] ?? 'WHATSAPP_TYPE_UNKNOWN')}</span>
              </span>
            </div>
            <div className="rounded-xl border border-border bg-surface p-2.5">
              <span className="text-[10px] uppercase font-semibold text-text-secondary block">Dispatch Mode</span>
              <span className="text-xs font-bold mt-0.5 flex items-center gap-1 truncate">
                {isAutoApi ? (
                  <span className="text-info-text flex items-center gap-1"><Server size={11} /> 1x Server API</span>
                ) : (
                  <span className="text-success-text flex items-center gap-1"><Smartphone size={11} /> Free Web</span>
                )}
              </span>
            </div>
            <div className="rounded-xl border border-border bg-surface p-2.5">
              <span className="text-[10px] uppercase font-semibold text-text-secondary block">Status</span>
              <span className={`text-xs font-bold mt-0.5 block ${viewLog.status === 'Delivered' ? 'text-success-text' : viewLog.status === 'Failed' ? 'text-danger-text' : 'text-warning-text'}`}>
                {viewLog.status}
              </span>
            </div>
          </div>

          {viewLog.error && (
            <div className="rounded-xl border border-danger bg-danger-bg p-3 text-xs text-danger-text flex items-start gap-2.5">
              <AlertCircle size={16} className="text-danger-text shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-danger-text block">{t('WHATSAPP_ERROR_PREFIX')} {viewLog.error}</span>
                <span className="text-[11px] text-text-secondary mt-0.5 block">
                  The recipient number is not registered on WhatsApp. Verify the student mobile number at reception.
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onCopy(viewLog.message)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text-primary hover:bg-card-hover motion-safe:transition-all cursor-pointer"
              >
                <Copy size={13} />
                <span>Copy Message Text</span>
              </button>
              {viewLog.status === 'Failed' && (
                <button
                  type="button"
                  data-testid={`admin_communication-modal-retry-${viewLog.id}`}
                  onClick={() => onRetry(viewLog.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-warning bg-warning-bg px-3.5 py-2 text-xs font-semibold text-warning-text hover:opacity-90 motion-safe:transition-all cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Retry Dispatch</span>
                </button>
              )}
            </div>

            <button
              data-testid="admin_communication-page-control-008"
              type="button"
              onClick={onClose}
              className="rounded-xl bg-surface border border-border px-4 py-2 text-xs font-semibold text-text-primary hover:bg-card-hover motion-safe:transition-colors cursor-pointer"
            >
              {t('BUTTON_CLOSE')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default AdminCommunicationWhatsappLogsViewModal;
