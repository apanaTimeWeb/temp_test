'use client';
// RESPONSIBILITY: Overview view for Notification Center showing KPI metrics, filters, and feed.
// FLOW: SuperadminCommunicationNotificationCenterMain -> Overview -> list & actions.

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Globe,
  HelpCircle,
  Mail,
  MessageSquare,
  PhoneCall,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useSuperadminCommunicationNotificationCenterStore } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';
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
import { SuperadminCommunicationNotificationCenterOverviewKpis } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterOverviewKpis';
import { SuperadminCommunicationNotificationCenterOverviewFilters } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterOverviewFilters';

export function SuperadminCommunicationNotificationCenterOverview() {
  const {
    targetScopeFilter,
    setTargetScopeFilter,
    channelFilter,
    setChannelFilter,
    statusFilter,
    setStatusFilter,
    categoryFilter,
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
      <SuperadminCommunicationNotificationCenterOverviewKpis
        usage={usage}
        failedCount={failedCount}
      />

      {/* Filter and Search Bar */}
      <SuperadminCommunicationNotificationCenterOverviewFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        targetScopeFilter={targetScopeFilter}
        setTargetScopeFilter={setTargetScopeFilter}
        channelFilter={channelFilter}
        setChannelFilter={setChannelFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        resetFilters={resetFilters}
      />

      {/* Notification Activity Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Activity Feed ({filteredNotifications.length})
          </h3>
          <span className="text-2xs text-muted-foreground">Click notification card to inspect payload & logs</span>
        </div>

        {filteredNotifications.length === 0 ? (
          <SuperadminCommunicationNotificationCenterEmptyState />
        ) : (
          <div className="space-y-2.5">
            {filteredNotifications.map((n) => {
              const statusCfg = NOTIFICATION_STATUS_CONFIG[n.status];
              const priorityCfg = NOTIFICATION_PRIORITY_CONFIG[n.priority];
              const isRetrying = retryingId === n.id;

              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNotification(n)}
                  className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 transition-all cursor-pointer shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                  data-testid={`notif-card-${n.id}`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 shrink-0 text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {n.category === 'ADMIN_INVITATION' && <Send className="w-4 h-4 text-sky-400" />}
                      {n.category === 'MAINTENANCE_ALERT' && <Clock className="w-4 h-4 text-amber-400" />}
                      {n.category === 'SYSTEM_OUTAGE_NOTIFICATION' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                      {n.category === 'SECURITY_ALERT' && <ShieldAlert className="w-4 h-4 text-purple-400" />}
                      {n.category === 'WELCOME_MESSAGE' && <Sparkles className="w-4 h-4 text-emerald-400" />}
                      {n.category === 'SUBSCRIPTION_EXPIRY_REMINDER' && <Clock className="w-4 h-4 text-amber-400" />}
                      {n.category === 'PAYMENT_REMINDER' && <Clock className="w-4 h-4 text-blue-400" />}
                      {n.category === 'FAILED_PAYMENT_NOTIFICATION' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                      {n.category === 'BRANCH_CREATION_CONFIRMATION' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {n.category === 'PRODUCT_ANNOUNCEMENT' && <Sparkles className="w-4 h-4 text-purple-400" />}
                      {!['ADMIN_INVITATION', 'MAINTENANCE_ALERT', 'SYSTEM_OUTAGE_NOTIFICATION', 'SECURITY_ALERT', 'WELCOME_MESSAGE', 'SUBSCRIPTION_EXPIRY_REMINDER', 'PAYMENT_REMINDER', 'FAILED_PAYMENT_NOTIFICATION', 'BRANCH_CREATION_CONFIRMATION', 'PRODUCT_ANNOUNCEMENT'].includes(n.category) && (
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs sm:text-sm text-foreground truncate">
                          {n.title}
                        </span>
                        <span className={`text-2xs px-2 py-0.5 rounded-full font-semibold ${priorityCfg.badgeClass}`}>
                          {priorityCfg.label}
                        </span>
                        {n.targetScope === 'GLOBAL' ? (
                          <span className="text-2xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1 font-medium">
                            <Globe className="w-3 h-3" /> Global Broadcast
                          </span>
                        ) : (
                          <span className="text-2xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1 font-medium">
                            <Sparkles className="w-3 h-3" /> {n.targetAccount?.name ?? 'Account-Specific'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {n.message}
                      </p>

                      <div className="flex items-center gap-3 text-2xs text-muted-foreground/80 mt-1.5 flex-wrap">
                        <span>To: <strong className="text-foreground">{n.targetRecipient.name}</strong></span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {n.channels.includes('EMAIL') && <span title="Email"><Mail className="w-3 h-3 text-sky-400" /></span>}
                          {n.channels.includes('SMS') && <span title="SMS"><MessageSquare className="w-3 h-3 text-emerald-400" /></span>}
                          {n.channels.includes('WHATSAPP') && <span title="WhatsApp"><PhoneCall className="w-3 h-3 text-teal-400" /></span>}
                        </div>
                        <span>•</span>
                        <span>{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status badge & retry button */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                      {statusCfg.label}
                    </span>

                    {(n.status === 'FAILED' || n.status === 'BOUNCED') && (
                      <button
                        type="button"
                        onClick={(e) => handleRetry(n, e)}
                        disabled={isRetrying}
                        className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/30 text-xs font-semibold hover:bg-primary/20 transition-all flex items-center gap-1 cursor-pointer"
                        title={n.failureReason ?? 'Retry transmission'}
                      >
                        <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                        <span>Retry</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
