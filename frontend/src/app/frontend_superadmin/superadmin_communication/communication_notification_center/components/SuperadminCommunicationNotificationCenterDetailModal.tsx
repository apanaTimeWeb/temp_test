'use client';
// RESPONSIBILITY: Detail inspection modal with event timeline, failure diagnostics, and retry trigger in Cyber-Luxury styling.
// FLOW: SuperadminCommunicationNotificationCenterMain -> DetailModal -> retry / close.

import { useState } from 'react';
import {
  X,
  AlertTriangle,
  Globe,
  RefreshCw,
  Building2,
} from 'lucide-react';
import { useSuperadminCommunicationNotificationCenterStore } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';
import { useRetryNotificationMutation } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterQueries';
import {
  NOTIFICATION_PRIORITY_CONFIG,
  NOTIFICATION_STATUS_CONFIG,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/constants/SuperadminCommunicationNotificationCenterNotificationConstants';
import { useModalScrollLock } from '@/lib/useModalScrollLock';

export function SuperadminCommunicationNotificationCenterDetailModal() {
  const { selectedNotification, setSelectedNotification } = useSuperadminCommunicationNotificationCenterStore();
  const retryMutation = useRetryNotificationMutation();
  const [isRetrying, setIsRetrying] = useState(false);

  useModalScrollLock(Boolean(selectedNotification));

  if (!selectedNotification) return null;

  const statusCfg = NOTIFICATION_STATUS_CONFIG[selectedNotification.status] ?? NOTIFICATION_STATUS_CONFIG.PENDING;
  const priorityCfg = NOTIFICATION_PRIORITY_CONFIG[selectedNotification.priority] ?? NOTIFICATION_PRIORITY_CONFIG.NORMAL;
  const isFailed = selectedNotification.status === 'FAILED' || selectedNotification.status === 'BOUNCED';

  const handleRetry = async () => {
    setIsRetrying(true);
    const idempotencyKey = `idemp-retry-detail-${selectedNotification.id}-${Date.now()}`;
    try {
      const res = await retryMutation.mutateAsync({ id: selectedNotification.id, idempotencyKey });
      setSelectedNotification(res);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setSelectedNotification(null);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
        className="bg-gradient-to-br from-[#0c102b] via-[#090d24] to-[#050714] border border-indigo-500/30 shadow-2xl rounded-3xl w-full max-w-xl p-6 sm:p-7 relative space-y-4 text-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 ease-out"
        data-testid="notif-detail-dialog"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-indigo-500/20">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-2xs font-bold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                {statusCfg.label}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-2xs font-bold ${priorityCfg.badgeClass}`}>
                {priorityCfg.icon} {priorityCfg.label}
              </span>
            </div>
            <h2 id="detail-modal-title" className="text-base sm:text-lg font-bold text-white mt-1.5">
              {selectedNotification.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setSelectedNotification(null)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostics Box if Failed */}
        {isFailed && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
            <div className="flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-200">Transmission Failure Reason:</strong>
                <p className="mt-1 font-mono text-xs text-rose-300/90 leading-relaxed">
                  {selectedNotification.failureReason ?? 'Gateway rejected message'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-rose-500/20 text-2xs text-rose-400">
              <span>Retries Attempted: {selectedNotification.retryCount} of {selectedNotification.maxRetries}</span>
              <button
                type="button"
                disabled={isRetrying}
                onClick={handleRetry}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/20 active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'Retrying…' : 'Retry Transmission'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Target and Recipient Specs */}
        <div className="grid grid-cols-2 gap-3 text-xs p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/20">
          <div>
            <span className="text-2xs text-slate-400 uppercase font-bold block">Target Scope</span>
            {selectedNotification.targetScope === 'GLOBAL' ? (
              <span className="text-sky-300 font-semibold flex items-center gap-1.5 mt-1">
                <Globe className="w-3.5 h-3.5 text-sky-400" /> Global Broadcast
              </span>
            ) : (
              <span className="text-purple-300 font-semibold flex items-center gap-1.5 mt-1">
                <Building2 className="w-3.5 h-3.5 text-purple-400" /> {selectedNotification.targetAccount?.name ?? 'Specific Account'}
              </span>
            )}
          </div>

          <div>
            <span className="text-2xs text-slate-400 uppercase font-bold block">Recipient</span>
            <span className="text-white font-bold block mt-1">
              {selectedNotification.targetRecipient.name}
            </span>
            {selectedNotification.targetRecipient.email && (
              <span className="text-2xs text-slate-400 block">{selectedNotification.targetRecipient.email}</span>
            )}
          </div>

          <div>
            <span className="text-2xs text-slate-400 uppercase font-bold block">Active Channels</span>
            <div className="flex items-center gap-1.5 mt-1">
              {selectedNotification.channels.map((ch) => (
                <span key={ch} className="px-2 py-0.5 rounded-md text-2xs bg-slate-900 border border-indigo-500/30 text-slate-200 font-semibold">
                  {ch}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-2xs text-slate-400 uppercase font-bold block">Dispatched Timestamp</span>
            <span className="text-slate-300 block mt-1">
              {new Date(selectedNotification.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Message Payload */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-200">Message Content</span>
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/25 text-xs font-mono leading-relaxed whitespace-pre-wrap text-slate-200 shadow-inner">
            {selectedNotification.message}
          </div>
        </div>

        {/* Technical Metadata */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-indigo-500/15 text-2xs font-mono text-slate-400 space-y-1">
          <div><span className="text-slate-500">ID:</span> {selectedNotification.id}</div>
          <div><span className="text-slate-500">Idempotency Key:</span> {selectedNotification.idempotencyKey}</div>
          {selectedNotification.deliveredAt && (
            <div><span className="text-slate-500">Delivered At:</span> {selectedNotification.deliveredAt}</div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setSelectedNotification(null)}
            className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-indigo-500/25 font-semibold text-xs sm:text-sm cursor-pointer transition-all active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
