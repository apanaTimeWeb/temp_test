'use client';

import { SuperadminTablePagination } from '@/components/ui/table/SuperadminTablePagination';
// RESPONSIBILITY: Delivery tracking table with delivery status, failure reasons, and 1-click retry with Cyber-Luxury styling.
// FLOW: SuperadminCommunicationNotificationCenterMain -> LogsTable -> Detail drawer / Retry mutation.

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCheck,
  Clock,
  Eye,
  Mail,
  MessageSquare,
  PhoneCall,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
} from 'lucide-react';
import {
  useSuperadminNotificationsQuery,
  useRetryNotificationMutation,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterQueries';
import { useSuperadminCommunicationNotificationCenterStore } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';
import {
  NOTIFICATION_STATUS_CONFIG,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/constants/SuperadminCommunicationNotificationCenterNotificationConstants';
import type { NotificationRecord } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

export function SuperadminCommunicationNotificationCenterLogsTable() {
  const { data: notifications, isLoading } = useSuperadminNotificationsQuery();
  const { setSelectedNotification } = useSuperadminCommunicationNotificationCenterStore();
  const retryMutation = useRetryNotificationMutation();
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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

  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice(page * pageSize, (page + 1) * pageSize);
  }, [filteredLogs, page, pageSize]);

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
      <div className="p-8 rounded-2xl bg-[#0c102b]/85 border border-indigo-500/20 flex items-center justify-center text-slate-400 text-sm shadow-xl">
        <RefreshCw className="w-5 h-5 motion-safe:animate-spin mr-2 text-indigo-400" />
        <span>Loading delivery audit logs…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-[#0c102b]/85 border border-indigo-500/20 shadow-xl backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input maxLength={250}
            type="text"
            placeholder="Search delivery logs by recipient, library, or failure reason..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 motion-safe:transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="px-3 py-2 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-xs text-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 cursor-pointer shadow-inner"
          >
            <option value="ALL" className="bg-slate-900 text-slate-100">All Statuses</option>
            <option value="DELIVERED" className="bg-slate-900 text-slate-100">Delivered</option>
            <option value="SENT" className="bg-slate-900 text-slate-100">Sent</option>
            <option value="PENDING" className="bg-slate-900 text-slate-100">Pending</option>
            <option value="FAILED" className="bg-slate-900 text-slate-100">Failed</option>
            <option value="BOUNCED" className="bg-slate-900 text-slate-100">Bounced</option>
          </select>

          <select
            value={channelFilter}
            onChange={(e) => { setChannelFilter(e.target.value); setPage(0); }}
            className="px-3 py-2 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-xs text-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 cursor-pointer shadow-inner"
          >
            <option value="ALL" className="bg-slate-900 text-slate-100">All Channels</option>
            <option value="EMAIL" className="bg-slate-900 text-slate-100">Email</option>
            <option value="SMS" className="bg-slate-900 text-slate-100">SMS</option>
            <option value="WHATSAPP" className="bg-slate-900 text-slate-100">WhatsApp</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl bg-[#0a0d24]/90 border border-indigo-500/20 shadow-xl backdrop-blur-md">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-indigo-500/25 bg-slate-950/90 text-2xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3.5 font-bold">Recipient & Target</th>
              <th className="px-4 py-3.5 font-bold">Category</th>
              <th className="px-4 py-3.5 font-bold">Channels</th>
              <th className="px-4 py-3.5 font-bold">Delivery Status</th>
              <th className="px-4 py-3.5 font-bold">Diagnostics & Failure Reason</th>
              <th className="px-4 py-3.5 font-bold">Timestamp</th>
              <th className="px-4 py-3.5 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/15">
            {paginatedLogs.map((log) => {
              const statusCfg = NOTIFICATION_STATUS_CONFIG[log.status] ?? NOTIFICATION_STATUS_CONFIG.PENDING;
              const isFailed = log.status === 'FAILED' || log.status === 'BOUNCED';
              const isRetrying = retryingId === log.id;

              return (
                <tr
                  key={log.id}
                  onClick={() => setSelectedNotification(log)}
                  className="hover:bg-indigo-950/25 transition-colors cursor-pointer text-slate-200"
                  data-testid={`log-row-${log.id}`}
                >
                  {/* Recipient & Target */}
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-white text-xs sm:text-sm">{log.targetRecipient.name}</p>
                    <p className="text-2xs text-slate-400 mt-0.5">
                      {log.targetScope === 'GLOBAL' ? (
                        <span className="text-sky-300 font-semibold">Global Broadcast</span>
                      ) : (
                        <span className="text-purple-300 font-semibold">
                          {log.targetAccount?.name ?? 'Specific Account'}
                        </span>
                      )}
                    </p>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-semibold text-slate-300">
                      {log.category.replace(/_/g, ' ')}
                    </span>
                  </td>

                  {/* Channels */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {log.channels.map((ch) => (
                        <span
                          key={ch}
                          className="p-1 rounded-md bg-slate-900/80 border border-indigo-500/20 text-slate-300"
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
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
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
                  <td className="px-4 py-3.5 max-w-xs">
                    {isFailed && log.failureReason ? (
                      <div className="text-xs text-rose-300 leading-tight">
                        <span className="font-bold text-rose-200">Reason:</span> {log.failureReason}
                        <p className="text-2xs text-slate-400 mt-0.5">Retries: {log.retryCount}/{log.maxRetries}</p>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-xs">—</span>
                    )}
                  </td>

                  {/* Timestamp */}
                  <td className="px-4 py-3.5 text-2xs text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {isFailed && (
                        <button
                          type="button"
                          disabled={isRetrying}
                          onClick={(e) => handleRetry(log, e)}
                          className="px-3 py-1 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white text-xs font-semibold motion-safe:transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/20 active:scale-95 min-w-18 justify-center"
                          data-testid={`table-retry-btn-${log.id}`}
                        >
                          <RefreshCw className={`w-3 h-3 ${isRetrying ? 'motion-safe:animate-spin' : ''}`} />
                          <span>{isRetrying ? 'Retrying…' : 'Retry'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedNotification(log)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-slate-800/60 transition-colors"
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
        <SuperadminTablePagination
          page={page}
          pageSize={pageSize}
          totalItems={filteredLogs.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="notifications"
        />
      </div>
    </div>
  );
}
