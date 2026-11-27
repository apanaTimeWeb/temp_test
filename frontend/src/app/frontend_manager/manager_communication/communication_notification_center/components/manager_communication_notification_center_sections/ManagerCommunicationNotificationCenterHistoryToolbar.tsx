'use client';

import { Filter, Search, X } from 'lucide-react';

const CHANNEL_BUTTONS = [
  { id: 'all', label: 'All Channels', activeBg: 'rgba(99, 102, 241, 0.22)', activeBorder: '#6366f1', activeText: '#e0e7ff', activeGlow: '0 0 14px rgba(99, 102, 241, 0.45)' },
  { id: 'WhatsApp', label: '📱 WhatsApp', activeBg: 'rgba(16, 185, 129, 0.25)', activeBorder: '#10b981', activeText: '#d1fae5', activeGlow: '0 0 16px rgba(16, 185, 129, 0.5)' },
  { id: 'SMS', label: '💬 SMS', activeBg: 'rgba(245, 158, 11, 0.25)', activeBorder: '#f59e0b', activeText: '#fef3c7', activeGlow: '0 0 16px rgba(245, 158, 11, 0.5)' },
  { id: 'Email', label: '✉️ Email', activeBg: 'rgba(14, 165, 233, 0.25)', activeBorder: '#0ea5e9', activeText: '#e0f2fe', activeGlow: '0 0 16px rgba(14, 165, 233, 0.5)' },
];

const STATUS_BUTTONS = [
  { id: 'all', label: 'All Status', activeBg: 'rgba(99, 102, 241, 0.22)', activeBorder: '#6366f1', activeText: '#e0e7ff', activeGlow: '0 0 14px rgba(99, 102, 241, 0.45)' },
  { id: 'Delivered', label: '🟢 Delivered', activeBg: 'rgba(16, 185, 129, 0.25)', activeBorder: '#10b981', activeText: '#d1fae5', activeGlow: '0 0 16px rgba(16, 185, 129, 0.5)' },
  { id: 'Failed', label: '🔴 Failed', activeBg: 'rgba(244, 63, 94, 0.25)', activeBorder: '#f43f5e', activeText: '#ffe4e6', activeGlow: '0 0 16px rgba(244, 63, 94, 0.5)' },
];

interface ManagerCommunicationNotificationCenterHistoryToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  typeFilter: string;
  setTypeFilter: (val: string) => void;
  channelFilter: string;
  setChannelFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

/** Multi-filter search, message type, channel pill, and status pill toolbar for notification history. */
export function ManagerCommunicationNotificationCenterHistoryToolbar({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  channelFilter,
  setChannelFilter,
  statusFilter,
  setStatusFilter,
  hasActiveFilters,
  onResetFilters,
}: ManagerCommunicationNotificationCenterHistoryToolbarProps) {
  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-surface border border-border flex flex-col gap-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1 min-w-[200px] flex items-center">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none z-10" />
          <input
            maxLength={100}
            type="search"
            placeholder="Search recipient, type, or channel..."
            className="mgr-input mgr-input-with-icon h-10 !pl-10 text-xs sm:text-sm w-full rounded-xl bg-card border border-border focus:border-primary"
            style={{ paddingLeft: '2.6rem', paddingRight: searchQuery ? '2.25rem' : '1rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-primary rounded-md z-10 cursor-pointer"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="Filter by Message Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="mgr-select h-10 text-xs sm:text-sm py-1.5 px-3 min-w-[150px] rounded-xl bg-card border border-border focus:border-primary cursor-pointer"
          >
            <option value="all">All Message Types</option>
            <option value="Due reminder">🪙 Due reminder</option>
            <option value="Overdue reminder">⚠️ Overdue reminder</option>
            <option value="Membership expiry reminder">🔄 Expiry reminder</option>
            <option value="Reservation ready">🪑 Reservation ready</option>
            <option value="Manual member notification">💬 Manual notification</option>
            <option value="Announcement">📢 Announcement</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 cursor-pointer motion-safe:transition-colors"
              title="Reset all filters"
            >
              <X size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-secondary flex items-center gap-1 mr-1">
            <Filter size={11} />
            <span>Channel:</span>
          </span>
          {CHANNEL_BUTTONS.map((ch) => {
            const isSelected = channelFilter === ch.id;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setChannelFilter(ch.id)}
                style={isSelected ? { backgroundColor: ch.activeBg, borderColor: ch.activeBorder, color: ch.activeText, boxShadow: ch.activeGlow } : undefined}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold motion-safe:transition-all cursor-pointer border ${
                  isSelected ? 'font-bold' : 'bg-card border-border text-secondary hover:text-primary hover:bg-card hover:border-border-focus'
                }`}
              >
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-secondary mr-1">Status:</span>
          {STATUS_BUTTONS.map((st) => {
            const isSelected = statusFilter === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id)}
                style={isSelected ? { backgroundColor: st.activeBg, borderColor: st.activeBorder, color: st.activeText, boxShadow: st.activeGlow } : undefined}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold motion-safe:transition-all cursor-pointer border ${
                  isSelected ? 'font-bold' : 'bg-card border-border text-secondary hover:text-primary hover:bg-card hover:border-border-focus'
                }`}
              >
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
