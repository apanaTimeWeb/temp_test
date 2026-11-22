'use client';

import {
  ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL,
} from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/config/admin_communication_whatsapp_logs.url_config';
import type { AdminCommunicationWhatsappLog } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import {
  AlertCircle,
  Calendar,
  CheckCheck,
  CheckCircle2,
  Copy,
  RotateCcw,
  Server,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react';
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
      <DialogContent className="relative w-full max-w-[560px] overflow-hidden rounded-3xl border border-slate-800 bg-[#0d131f] p-0 shadow-2xl">
        {/* WhatsApp Brand Header */}
        <div className="bg-[#075e54] px-5 py-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600/50 border border-emerald-400/40 text-white font-bold text-sm shadow-inner shrink-0">
              {getInitials(viewLog.student)}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white tracking-tight flex items-center gap-1.5 leading-none">
                <span>{viewLog.student}</span>
                <ShieldCheck size={14} className="text-emerald-300 shrink-0" />
              </DialogTitle>
              <DialogDescription className="sr-only">{t('WHATSAPP_LOG_DETAILS_DESCRIPTION')}</DialogDescription>
              <div className="mt-1 flex items-center gap-2 text-xs text-emerald-100 font-mono">
                <span>+91 {viewLog.phone}</span>
                {viewLog.branch && (
                  <span className="rounded-full bg-black/25 px-2 py-0.5 font-sans text-[10px] text-emerald-200 border border-emerald-400/20">
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
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-emerald-100 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Chat Body & Message Bubble */}
        <div className="relative min-h-[220px] max-h-[340px] overflow-y-auto bg-[#0b141a] p-5 space-y-4">
          <div className="relative flex justify-center">
            <span className="rounded-full bg-slate-800/90 px-3.5 py-1 text-[11px] font-medium text-slate-300 shadow-sm border border-slate-700/60 flex items-center gap-1.5">
              <Calendar size={12} className="text-slate-400" />
              <span>Dispatched on {viewLog.dateTime}</span>
            </span>
          </div>

          <div className="relative ml-auto max-w-[88%] rounded-2xl rounded-tr-xs bg-[#005c4b] p-4 text-white shadow-lg space-y-2">
            <div className="whitespace-pre-wrap text-xs leading-relaxed text-slate-100 font-sans select-text">
              {viewLog.message}
            </div>
            <div className="mt-2 flex items-center justify-end gap-1.5 text-[10px] font-mono text-emerald-200">
              <span>{viewLog.dateTime.split(' ').slice(-2).join(' ')}</span>
              {viewLog.status === 'Delivered' ? (
                <span className="text-cyan-300 font-bold flex items-center gap-0.5" title="Delivered">
                  <CheckCheck size={13} /> Delivered
                </span>
              ) : viewLog.status === 'Sent' ? (
                <span className="text-slate-300 font-bold flex items-center gap-0.5" title="Sent">
                  <CheckCheck size={13} /> Sent
                </span>
              ) : viewLog.status === 'Failed' ? (
                <span className="text-rose-400 font-bold flex items-center gap-0.5" title="Failed">
                  ✕ Delivery Failed
                </span>
              ) : (
                <span className="text-amber-300 font-bold flex items-center gap-0.5" title="Pending">
                  ⏱ Queued
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Audit & Metadata Panel */}
        <div className="border-t border-slate-800 bg-[#0a0f18] p-5 space-y-3.5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Dispatch ID</span>
              <span className="font-mono text-xs font-bold text-white mt-0.5 block">#WA-LOG-00{viewLog.id}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Template</span>
              <span className="text-xs font-bold text-indigo-300 mt-0.5 flex items-center gap-1 truncate">
                <span>{WHATSAPP_TYPE_ICONS[viewLog.type] || '📱'}</span>
                <span className="truncate">{t(ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL[viewLog.type] ?? 'WHATSAPP_TYPE_UNKNOWN')}</span>
              </span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Dispatch Mode</span>
              <span className="text-xs font-bold mt-0.5 flex items-center gap-1 truncate">
                {isAutoApi ? (
                  <span className="text-indigo-400 flex items-center gap-1">
                    <Server size={11} /> 1x Server API
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Smartphone size={11} /> Free Web
                  </span>
                )}
              </span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Status</span>
              <span className={`text-xs font-bold mt-0.5 block ${viewLog.status === 'Delivered' ? 'text-emerald-400' : viewLog.status === 'Failed' ? 'text-rose-400' : 'text-amber-400'}`}>
                {viewLog.status}
              </span>
            </div>
          </div>

          {viewLog.error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-300 block">{t('WHATSAPP_ERROR_PREFIX')} {viewLog.error}</span>
                <span className="text-[11px] text-rose-300/80 mt-0.5 block">
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
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
              >
                <Copy size={13} />
                <span>Copy Message Text</span>
              </button>
              {viewLog.status === 'Failed' && (
                <button
                  type="button"
                  data-testid={`admin_communication-modal-retry-${viewLog.id}`}
                  onClick={() => onRetry(viewLog.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer"
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
              className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
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
