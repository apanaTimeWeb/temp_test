'use client';
// RESPONSIBILITY: Delivery tracking table with delivery status, failure reasons, and 1-click retry.
// FLOW: SuperadminCommunicationNotificationCenterMain -> LogsTable -> Detail drawer / Retry mutation.

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCheck,
  Clock,
  Eye,
  Globe,
  Mail,
  MessageSquare,
  PhoneCall,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import {
  useSuperadminNotificationsQuery,
  useRetryNotificationMutation,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterQueries';
import { useSuperadminCommunicationNotificationCenterStore } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';
import {
  NOTIFICATION_PRIORITY_CONFIG,
  NOTIFICATION_STATUS_CONFIG,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/constants/SuperadminCommunicationNotificationCenterNotificationConstants';
import type { NotificationRecord } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

export function SuperadminCommunicationNotificationCenterLogsTable() {
  const { data: notifications, isLoading, isError } = useSuperadminNotificationsQuery();
  const { setSelectedNotification } = useSuperadminCommunicationNotificationCenterStore();
  const retryMutation = useRetryNotificationMutation();
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');

  const filteredLogs = useMemo(() => {
    if (!notifications) return [];
    return notifications.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (channelFilter !== 'ALL' && !item.channels.includes(channelFilter as never)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const m1 = item.title.toLowerCase().includes(q);
        const m2 = item.targetRecipient.name.toLowerCase().includes(q);
        const m3 = item.targetAccount?.name.toLowerCase().includes(q) ?? false;
        const m4 = item.failureReason?.toLowerCase().includes(q) ?? false;
        if (!m1 && !m2 && !m3 && !m4) return false;
      }
      return true;
    });
  }, [notifications, statusFilter, channelFilter, search]);

  const handleRetry = async (record: NotificationRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setRetryingId(record.id);
    const idempotencyKey = `idemp-retry-table-${record.id}-${Date.now()}`;
    try {
      await retryMutation.mutateAsync({ id: record.id, idempotencyKey });
    } finally {
      setRetryingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 rounded-2xl bg-card border border-border/80 flex items-center justify-center text-muted-foreground text-sm">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
        <span>Loading delivery logs…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search delivery logs by recipient, library, or failure reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/40 border border-border/60 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="DELIVERED">Delivered</option>
            <option value="SENT">Sent</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="BOUNCED">Bounced</option>
          </select>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Channels</option>
            <option value="EMAIL">Email</option>
            <option value="SMS">SMS</option>
            <option value="WHATSAPP">WhatsApp</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-card border border-border/80 shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-border/80 bg-muted/30 text-2xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Recipient & Target</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Channels</th>
              <th className="px-4 py-3">Delivery Status</th>
              <th className="px-4 py-3">Diagnostics & Failure Reason</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredLogs.map((log) => {
              const statusCfg = NOTIFICATION_STATUS_CONFIG[log.status] ?? NOTIFICATION_STATUS_CONFIG.PENDING;
              const isFailed = log.status === 'FAILED' || log.status === 'BOUNCED';
              const isRetrying = retryingId === log.id;

              return (
                <tr
                  key={log.id}
                  onClick={() => setSelectedNotification(log)}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  data-testid={`log-row-${log.id}`}
                >
                  {/* Recipient & Target */}
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">{log.targetRecipient.name}</p>
                    <p className="text-2xs text-muted-foreground">
                      {log.targetScope === 'GLOBAL' ? (
                        <span className="text-sky-400 font-medium">Global Broadcast</span>
                      ) : (
                        <span className="text-purple-400 font-medium">
                          {log.targetAccount?.name ?? 'Specific Account'}
                        </span>
                      )}
                    </p>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-foreground">
                      {log.category.replace(/_/g, ' ')}
                    </span>
                  </td>

                  {/* Channels */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {log.channels.map((ch) => (
                        <span
                          key={ch}
                          className="p-1 rounded bg-muted/60 text-muted-foreground"
                          title={ch}
                        >
                          {ch === 'EMAIL' && <Mail className="w-3.5 h-3.5 text-sky-400" />}
                          {ch === 'SMS' && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                          {ch === 'WHATSAPP' && <PhoneCall className="w-3.5 h-3.5 text-teal-400" />}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                    >
                      {log.status === 'DELIVERED' && <CheckCheck className="w-3 h-3" />}
                      {log.status === 'SENT' && <Send className="w-3 h-3" />}
                      {log.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {log.status === 'FAILED' && <AlertTriangle className="w-3 h-3" />}
                      {log.status === 'BOUNCED' && <ShieldAlert className="w-3 h-3" />}
                      <span>{statusCfg.label}</span>
                    </span>
                  </td>

                  {/* Failure Diagnostics */}
                  <td className="px-4 py-3 max-w-xs">
                    {isFailed && log.failureReason ? (
                      <div className="text-xs text-rose-400 leading-tight">
                        <span className="font-semibold">Reason:</span> {log.failureReason}
                        <p className="text-2xs text-muted-foreground mt-0.5">Retries: {log.retryCount}/{log.maxRetries}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>

                  {/* Timestamp */}
                  <td className="px-4 py-3 text-2xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {isFailed && (
                        <button
                          type="button"
                          disabled={isRetrying}
                          onClick={(e) => handleRetry(log, e)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer min-w-16 justify-center"
                          data-testid={`table-retry-btn-${log.id}`}
                        >
                          <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                          <span>{isRetrying ? 'Retrying…' : 'Retry'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedNotification(log)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        title="View Full Timeline"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
