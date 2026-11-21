'use client';
// RESPONSIBILITY: Search input and multi-dimensional filter bar for notification overview.
// FLOW: Overview -> OverviewFilters -> update filter state.

import { Filter, Globe, Search, Sparkles } from 'lucide-react';
import type {
  NotificationChannel,
  NotificationDeliveryStatus,
  NotificationTargetScope,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

interface OverviewFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  targetScopeFilter: NotificationTargetScope | 'ALL';
  setTargetScopeFilter: (s: NotificationTargetScope | 'ALL') => void;
  channelFilter: NotificationChannel | 'ALL';
  setChannelFilter: (c: NotificationChannel | 'ALL') => void;
  statusFilter: NotificationDeliveryStatus | 'ALL';
  setStatusFilter: (st: NotificationDeliveryStatus | 'ALL') => void;
  resetFilters: () => void;
}

export function SuperadminCommunicationNotificationCenterOverviewFilters({
  searchQuery,
  setSearchQuery,
  targetScopeFilter,
  setTargetScopeFilter,
  channelFilter,
  setChannelFilter,
  statusFilter,
  setStatusFilter,
  resetFilters,
}: OverviewFiltersProps) {
  return (
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
              targetScopeFilter === 'ALL'
                ? 'bg-card text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Targets
          </button>
          <button
            type="button"
            onClick={() => setTargetScopeFilter('GLOBAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              targetScopeFilter === 'GLOBAL'
                ? 'bg-card text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Globe className="w-3 h-3 text-sky-400" />
            <span>Global Broadcasts</span>
          </button>
          <button
            type="button"
            onClick={() => setTargetScopeFilter('ACCOUNT_SPECIFIC')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1 ${
              targetScopeFilter === 'ACCOUNT_SPECIFIC'
                ? 'bg-card text-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
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
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
