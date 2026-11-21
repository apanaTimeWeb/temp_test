'use client';
// RESPONSIBILITY: Search input and multi-dimensional filter bar for notification overview with Cyber-Luxury styling.
// FLOW: Overview -> OverviewFilters -> update filter state.

import { Filter, Globe, RotateCcw, Search, Sparkles } from 'lucide-react';
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
  const isFilterActive = targetScopeFilter !== 'ALL' || channelFilter !== 'ALL' || statusFilter !== 'ALL' || searchQuery.trim().length > 0;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0c102b]/85 border border-indigo-500/20 shadow-xl backdrop-blur-md space-y-3.5">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, recipient, library name or message content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition-all shadow-inner"
            data-testid="notif-search-input"
          />
        </div>

        {/* Quick Target Scope Pills */}
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-indigo-500/25 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setTargetScopeFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              targetScopeFilter === 'ALL'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            All Targets
          </button>
          <button
            type="button"
            onClick={() => setTargetScopeFilter('GLOBAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              targetScopeFilter === 'GLOBAL'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>Global Broadcasts</span>
          </button>
          <button
            type="button"
            onClick={() => setTargetScopeFilter('ACCOUNT_SPECIFIC')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              targetScopeFilter === 'ACCOUNT_SPECIFIC'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Account-Specific</span>
          </button>
        </div>
      </div>

      {/* Secondary dropdown filters */}
      <div className="flex items-center gap-2.5 flex-wrap text-xs pt-2 border-t border-indigo-500/20">
        <span className="text-slate-400 font-medium flex items-center gap-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>Filters:</span>
        </span>

        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value as never)}
          className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-slate-200 text-xs focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 cursor-pointer shadow-inner"
        >
          <option value="ALL" className="bg-slate-900 text-slate-100">All Channels (Email, SMS, WhatsApp)</option>
          <option value="EMAIL" className="bg-slate-900 text-slate-100">Email Only</option>
          <option value="SMS" className="bg-slate-900 text-slate-100">SMS Only</option>
          <option value="WHATSAPP" className="bg-slate-900 text-slate-100">WhatsApp Only</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as never)}
          className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-slate-200 text-xs focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 cursor-pointer shadow-inner"
        >
          <option value="ALL" className="bg-slate-900 text-slate-100">All Statuses</option>
          <option value="DELIVERED" className="bg-slate-900 text-slate-100">Delivered</option>
          <option value="SENT" className="bg-slate-900 text-slate-100">Sent / In-Transit</option>
          <option value="PENDING" className="bg-slate-900 text-slate-100">Pending in Queue</option>
          <option value="FAILED" className="bg-slate-900 text-slate-100">Failed</option>
          <option value="BOUNCED" className="bg-slate-900 text-slate-100">Bounced</option>
        </select>

        {isFilterActive && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-indigo-500/20 text-xs font-semibold cursor-pointer transition-all"
          >
            <RotateCcw className="w-3 h-3 text-indigo-400" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
