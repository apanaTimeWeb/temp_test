'use client';
// RESPONSIBILITY: Detail inspection modal with event timeline, failure diagnostics, and retry trigger.
// FLOW: SuperadminCommunicationNotificationCenterMain -> DetailModal -> retry / close.

import { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCheck,
  Clock,
  Send,
  ShieldAlert,
  RefreshCw,
  Mail,
  MessageSquare,
  PhoneCall,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useSuperadminCommunicationNotificationCenterStore } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';
import { useRetryNotificationMutation } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterQueries';
import {
  NOTIFICATION_PRIORITY_CONFIG,
  NOTIFICATION_STATUS_CONFIG,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/constants/SuperadminCommunicationNotificationCenterNotificationConstants';

export function SuperadminCommunicationNotificationCenterDetailModal() {
  const { selectedNotification, setSelectedNotification } = useSuperadminCommunicationNotificationCenterStore();
  const retryMutation = useRetryNotificationMutation();
  const [isRetrying, setIsRetrying] = useState(false);

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
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setSelectedNotification(null);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
        className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-xl p-6 relative my-8 space-y-4"
        data-testid="notif-detail-dialog"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-2xs font-bold ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                {statusCfg.label}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-2xs font-bold ${priorityCfg.badgeClass}`}>
                {priorityCfg.icon} {priorityCfg.label}
              </span>
            </div>
            <h2 id="detail-modal-title" className="text-base font-bold text-foreground mt-1">
              {selectedNotification.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setSelectedNotification(null)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostics Box if Failed */}
        {isFailed && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
            <div className="flex items-start gap-2 text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-200">Transmission Failure Reason:</strong>
                <p className="mt-0.5 font-mono text-xs">{selectedNotification.failureReason ?? 'Gateway rejected message'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-rose-500/20 text-2xs text-rose-400">
              <span>Retries Attempted: {selectedNotification.retryCount} of {selectedNotification.maxRetries}</span>
              <button
                type="button"
                disabled={isRetrying}
                onClick={handleRetry}
                className="px-3 py-1.5 rounded-lg bg-rose-500 text-white font-semibold text-xs hover:bg-rose-600 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? 'Retrying…' : 'Retry Transmission'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Target and Recipient Specs */}
        <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-muted/30 border border-border/50">
          <div>
            <span className="text-2xs text-muted-foreground uppercase font-semibold block">Target Scope</span>
            {selectedNotification.targetScope === 'GLOBAL' ? (
              <span className="text-sky-400 font-medium flex items-center gap-1 mt-0.5">
                <Globe className="w-3.5 h-3.5" /> Global Broadcast
              </span>
            ) : (
              <span className="text-purple-400 font-medium flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" /> {selectedNotification.targetAccount?.name ?? 'Specific Account'}
              </span>
            )}
          </div>

          <div>
            <span className="text-2xs text-muted-foreground uppercase font-semibold block">Recipient</span>
            <span className="text-foreground font-semibold block mt-0.5">
              {selectedNotification.targetRecipient.name}
            </span>
            {selectedNotification.targetRecipient.email && (
              <span className="text-2xs text-muted-foreground block">{selectedNotification.targetRecipient.email}</span>
            )}
          </div>

          <div>
            <span className="text-2xs text-muted-foreground uppercase font-semibold block">Active Channels</span>
            <div className="flex items-center gap-1 mt-1">
              {selectedNotification.channels.map((ch) => (
                <span key={ch} className="px-1.5 py-0.5 rounded text-2xs bg-card border border-border/60">
                  {ch}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-2xs text-muted-foreground uppercase font-semibold block">Dispatched Timestamp</span>
            <span className="text-muted-foreground block mt-0.5">
              {new Date(selectedNotification.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Message Payload */}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-foreground">Message Content</span>
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs font-mono leading-relaxed whitespace-pre-wrap text-foreground">
            {selectedNotification.message}
          </div>
        </div>

        {/* Technical Metadata */}
        <div className="p-3 rounded-xl bg-muted/20 border border-border/40 text-2xs font-mono text-muted-foreground space-y-1">
          <div>ID: {selectedNotification.id}</div>
          <div>Idempotency Key: {selectedNotification.idempotencyKey}</div>
          {selectedNotification.deliveredAt && <div>Delivered At: {selectedNotification.deliveredAt}</div>}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setSelectedNotification(null)}
            className="px-4 py-2 rounded-xl bg-muted/60 text-foreground font-semibold text-xs cursor-pointer hover:bg-muted"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
