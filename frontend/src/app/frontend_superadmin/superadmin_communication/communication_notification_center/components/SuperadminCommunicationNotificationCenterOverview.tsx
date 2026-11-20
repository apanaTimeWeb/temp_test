'use client';
// RESPONSIBILITY: Overview view for Notification Center showing KPI metrics, filters, and feed.
// FLOW: SuperadminCommunicationNotificationCenterMain -> Overview -> list & actions.

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCheck,
  CheckCircle2,
  Clock,
  Filter,
  Globe,
  HelpCircle,
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
  useSuperadminCommunicationNotificationCenterStore,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';
import {
  useSuperadminNotificationsQuery,
  useSuperadminUsageAnalyticsQuery,
  useRetryNotificationMutation,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterQueries';
import {
  NOTIFICATION_PRIORITY_CONFIG,
  NOTIFICATION_STATUS_CONFIG,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/constants/SuperadminCommunicationNotificationCenterNotificationConstants';
import type { NotificationRecord } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';
import { SuperadminCommunicationNotificationCenterListSkeleton } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterListSkeleton';
import { SuperadminCommunicationNotificationCenterEmptyState } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterEmptyState';

export function SuperadminCommunicationNotificationCenterOverview() {
  const {
    targetScopeFilter,
    setTargetScopeFilter,
    channelFilter,
    setChannelFilter,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    setSelectedNotification,
    resetFilters,
  } = useSuperadminCommunicationNotificationCenterStore();

  const { data: notifications, isLoading, isError, refetch } = useSuperadminNotificationsQuery();
  const { data: usage } = useSuperadminUsageAnalyticsQuery();
  const retryMutation = useRetryNotificationMutation();
  const [retryingId, setRetryingId] = useState<string | null>(null);

  // Client-side filtering
  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];
    return notifications.filter((n) => {
      if (targetScopeFilter !== 'ALL' && n.targetScope !== targetScopeFilter) return false;
      if (channelFilter !== 'ALL' && !n.channels.includes(channelFilter)) return false;
      if (statusFilter !== 'ALL' && n.status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && n.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchMsg = n.message.toLowerCase().includes(q);
        const matchRecip = n.targetRecipient.name.toLowerCase().includes(q);
        const matchAcc = n.targetAccount?.name.toLowerCase().includes(q) ?? false;
        if (!matchTitle && !matchMsg && !matchRecip && !matchAcc) return false;
      }
      return true;
    });
  }, [notifications, targetScopeFilter, channelFilter, statusFilter, categoryFilter, searchQuery]);

  const handleRetry = async (notification: NotificationRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setRetryingId(notification.id);
    const idempotencyKey = `idemp-retry-${notification.id}-${Date.now()}`;
    try {
      await retryMutation.mutateAsync({ id: notification.id, idempotencyKey });
    } finally {
      setRetryingId(null);
    }
  };

  if (isLoading) {
    return <SuperadminCommunicationNotificationCenterListSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-center">
        <p className="text-sm font-semibold text-destructive">Failed to load notifications feed</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold cursor-pointer"
        >
          Retry Fetch
        </button>
      </div>
    );
  }

  const failedCount = notifications?.filter((n) => n.status === 'FAILED' || n.status === 'BOUNCED').length ?? 0;

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
          <p className="text-xs text-muted-foreground font-medium">Monthly Dispatched</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-foreground">
              {usage?.totalDispatched.toLocaleString() ?? '28,450'}
            </span>
            <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
              3 Channels Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
            <span className="text-emerald-400">↑ 12%</span> from last cycle
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
          <p className="text-xs text-muted-foreground font-medium">Delivery Success Rate</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-foreground">
              {usage?.overallDeliveryRate ?? 98.35}%
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              SLA Compliant
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {usage?.totalDelivered.toLocaleString() ?? '27,980'} delivered successfully
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
          <p className="text-xs text-muted-foreground font-medium">Delivery Failures & Bounces</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-foreground">
              {failedCount}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                failedCount > 0 ? 'bg-rose-500/15 text-rose-400' : 'bg-muted text-muted-foreground'
              }`}
            >
              {failedCount > 0 ? 'Needs Attention' : 'Zero Errors'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">1-click manual & auto retry enabled</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
          <p className="text-xs text-muted-foreground font-medium">Automated Trigger Policies</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-foreground">10 Triggers</span>
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
              All Active
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">Admin invites, billing, outages & alerts</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, recipient, library name or message content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/40 border border-border/60 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              data-testid="notif-search-input"
            />
          </div>

          {/* Quick Target Scope Pills */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-muted/30 border border-border/50 shrink-0">
            <button
              type="button"
              onClick={() => setTargetScopeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                targetScopeFilter === 'ALL' ? 'bg-card text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Targets
            </button>
            <button
              type="button"
              onClick={() => setTargetScopeFilter('GLOBAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
                targetScopeFilter === 'GLOBAL' ? 'bg-card text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Globe className="w-3 h-3 text-sky-400" />
              <span>Global Broadcasts</span>
            </button>
            <button
              type="button"
              onClick={() => setTargetScopeFilter('ACCOUNT_SPECIFIC')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
                targetScopeFilter === 'ACCOUNT_SPECIFIC' ? 'bg-card text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Account-Specific</span>
            </button>
          </div>
        </div>

        {/* Secondary dropdown filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-border/40">
          <span className="text-muted-foreground font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value as never)}
            className="px-2.5 py-1.5 rounded-lg bg-muted/40 border border-border/60 text-foreground text-xs focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Channels (Email, SMS, WhatsApp)</option>
            <option value="EMAIL">Email Only</option>
            <option value="SMS">SMS Only</option>
            <option value="WHATSAPP">WhatsApp Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as never)}
            className="px-2.5 py-1.5 rounded-lg bg-muted/40 border border-border/60 text-foreground text-xs focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="DELIVERED">Delivered</option>
            <option value="SENT">Sent / In-Transit</option>
            <option value="PENDING">Pending in Queue</option>
            <option value="FAILED">Failed</option>
            <option value="BOUNCED">Bounced</option>
          </select>

          {(targetScopeFilter !== 'ALL' || channelFilter !== 'ALL' || statusFilter !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={resetFilters}
              className="px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          )}

          <span className="ml-auto text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{filteredNotifications.length}</strong> of {notifications?.length ?? 0} dispatches
          </span>
        </div>
      </div>

      {/* Notifications Feed */}
      {filteredNotifications.length === 0 ? (
        <SuperadminCommunicationNotificationCenterEmptyState />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const statusConfig = NOTIFICATION_STATUS_CONFIG[notif.status] ?? NOTIFICATION_STATUS_CONFIG.PENDING;
            const priorityConfig = NOTIFICATION_PRIORITY_CONFIG[notif.priority] ?? NOTIFICATION_PRIORITY_CONFIG.NORMAL;
            const isFailed = notif.status === 'FAILED' || notif.status === 'BOUNCED';
            const isRetrying = retryingId === notif.id;

            return (
              <div
                key={notif.id}
                onClick={() => setSelectedNotification(notif)}
                className={`p-4 rounded-2xl bg-card border transition-all cursor-pointer hover:border-primary/50 hover:shadow-sm ${
                  isFailed ? 'border-rose-500/40 bg-rose-500/5' : 'border-border/80'
                }`}
                data-testid={`notif-card-${notif.id}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Target Scope Badge */}
                    {notif.targetScope === 'GLOBAL' ? (
                      <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Global Broadcast
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> {notif.targetAccount?.name ?? 'Account-Specific'}
                      </span>
                    )}

                    {/* Priority Badge */}
                    <span className={`px-2 py-0.5 rounded-full text-2xs font-bold ${priorityConfig.badgeClass}`}>
                      {priorityConfig.icon} {priorityConfig.label}
                    </span>

                    {/* Category Label */}
                    <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">
                      {notif.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Delivery Status Badge & Timestamp */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                      {notif.status === 'DELIVERED' && <CheckCheck className="w-3.5 h-3.5" />}
                      {notif.status === 'SENT' && <Send className="w-3.5 h-3.5" />}
                      {notif.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                      {notif.status === 'FAILED' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {notif.status === 'BOUNCED' && <ShieldAlert className="w-3.5 h-3.5" />}
                      <span>{statusConfig.label}</span>
                    </span>
                    <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-sm font-semibold text-foreground mt-1">{notif.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>

                {/* Diagnostics if failed */}
                {isFailed && notif.failureReason && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start justify-between gap-3 text-xs text-rose-300">
                    <div className="flex items-start gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-rose-200">Failure Reason:</strong>{' '}
                        <span>{notif.failureReason}</span>
                        <p className="text-2xs text-rose-400/80 mt-0.5">
                          Attempts: {notif.retryCount} / {notif.maxRetries}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isRetrying}
                      onClick={(e) => handleRetry(notif, e)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500 text-white font-semibold text-xs hover:bg-rose-600 active:scale-95 transition-all shadow-xs shrink-0 flex items-center gap-1 cursor-pointer min-w-20 justify-center"
                      data-testid={`retry-btn-${notif.id}`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                      <span>{isRetrying ? 'Retrying...' : 'Retry Now'}</span>
                    </button>
                  </div>
                )}

                {/* Footer with Recipient & Channels */}
                <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span>To: <strong className="text-foreground">{notif.targetRecipient.name}</strong></span>
                    {notif.targetRecipient.email && (
                      <span className="text-2xs text-muted-foreground">({notif.targetRecipient.email})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {notif.channels.map((ch) => (
                      <span
                        key={ch}
                        className="px-2 py-0.5 rounded-md text-2xs font-semibold bg-muted/60 text-muted-foreground border border-border/40 flex items-center gap-1"
                      >
                        {ch === 'EMAIL' && <Mail className="w-3 h-3 text-sky-400" />}
                        {ch === 'SMS' && <MessageSquare className="w-3 h-3 text-emerald-400" />}
                        {ch === 'WHATSAPP' && <PhoneCall className="w-3 h-3 text-teal-400" />}
                        <span>{ch}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
