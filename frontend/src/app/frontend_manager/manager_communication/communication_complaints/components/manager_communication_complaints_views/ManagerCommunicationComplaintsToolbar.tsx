'use client';

import React from 'react';
import { Search, X, Download, Filter, AlertCircle, Clock, CheckCircle2, Layers } from 'lucide-react';
import { MANAGER_COMMUNICATION_COMPLAINT_TABS } from '../../constants/ManagerCommunicationComplaintsComplaintConstants';
import type {
  ManagerCommunicationComplaintsComplaint,
  ManagerCommunicationComplaintsComplaintStatus,
} from '../../types/ManagerCommunicationComplaintsTypes';

interface ManagerCommunicationComplaintsToolbarProps {
  tab: ManagerCommunicationComplaintsComplaintStatus | 'All';
  setTab: (tab: ManagerCommunicationComplaintsComplaintStatus | 'All') => void;
  allComplaints: ManagerCommunicationComplaintsComplaint[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCsv: () => void;
  onResetPage: () => void;
}

export function ManagerCommunicationComplaintsToolbar({
  tab,
  setTab,
  allComplaints,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  hasActiveFilters,
  onResetFilters,
  onExportCsv,
  onResetPage,
}: ManagerCommunicationComplaintsToolbarProps) {
  const TAB_CONFIG: Record<
    string,
    {
      activeClass: string;
      badgeActive: string;
      icon: typeof Layers;
      iconClass: string;
    }
  > = {
    All: {
      activeClass: 'bg-indigo-500/15 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/30 shadow-xs font-bold',
      badgeActive: 'bg-indigo-500/25 border-indigo-500/40 text-indigo-200',
      icon: Layers,
      iconClass: 'text-indigo-400',
    },
    Open: {
      activeClass: 'bg-rose-500/15 border-rose-500 text-rose-300 ring-2 ring-rose-500/30 shadow-xs font-bold',
      badgeActive: 'bg-rose-500/25 border-rose-500/40 text-rose-200',
      icon: AlertCircle,
      iconClass: 'text-rose-400',
    },
    'In-Progress': {
      activeClass: 'bg-amber-500/15 border-amber-500 text-amber-300 ring-2 ring-amber-500/30 shadow-xs font-bold',
      badgeActive: 'bg-amber-500/25 border-amber-500/40 text-amber-200',
      icon: Clock,
      iconClass: 'text-amber-400',
    },
    Resolved: {
      activeClass: 'bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30 shadow-xs font-bold',
      badgeActive: 'bg-emerald-500/25 border-emerald-500/40 text-emerald-200',
      icon: CheckCircle2,
      iconClass: 'text-emerald-400',
    },
  };

  return (
    <div className="flex flex-col gap-3.5 mb-5 p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-xs">
      {/* Top Row: Segmented Status Pills with Visual Color Fill When Clicked */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {MANAGER_COMMUNICATION_COMPLAINT_TABS.map((item) => {
            const count =
              item === 'All' ? allComplaints.length : allComplaints.filter((c) => c.status === item).length;
            const isActive = tab === item;
            const config = TAB_CONFIG[item] || TAB_CONFIG.All;
            const TabIcon = config.icon;
            return (
              <button
                type="button"
                key={item}
                onClick={() => {
                  setTab(item);
                  onResetPage();
                }}
                className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer border ${
                  isActive
                    ? config.activeClass
                    : 'bg-card/60 border-border text-secondary hover:text-primary hover:bg-surface-hover hover:border-border-focus'
                }`}
                aria-pressed={isActive}
              >
                <TabIcon
                  size={14}
                  className={isActive ? config.iconClass : 'text-secondary/70 group-hover:text-primary'}
                />
                <span>{item}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold border transition-colors ${
                    isActive
                      ? config.badgeActive
                      : 'bg-surface border-border text-secondary group-hover:text-primary'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Controls: Export CSV */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onExportCsv}
            className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold h-10 px-3.5 rounded-xl border border-border bg-card hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors cursor-pointer"
            title="Export Complaints CSV"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Non-Overlapping Search Box & Category Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input with Guaranteed Non-Overlapping Icon & Clear Button */}
        <div className="relative flex-1 min-w-[220px] flex items-center">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none z-10"
          />
          <input
            type="search"
            placeholder="Search complaint, student name, seat, or issue..."
            className="mgr-input mgr-input-with-icon h-10 !pl-10 text-xs sm:text-sm w-full rounded-xl bg-surface/60 border border-border focus:border-primary"
            style={{ paddingLeft: '2.6rem', paddingRight: searchQuery ? '2.25rem' : '1rem' }}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onResetPage();
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onResetPage();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-primary rounded-md z-10 cursor-pointer"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Category Dropdown and Reset Filter Button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            aria-label="Filter by Category"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              onResetPage();
            }}
            className="mgr-select h-10 text-xs sm:text-sm py-1.5 px-3 min-w-[160px] rounded-xl bg-surface/60 border border-border focus:border-primary cursor-pointer w-full md:w-auto"
          >
            <option value="all">📂 All Categories</option>
            <option value="AC">❄️ Air Conditioning / AC</option>
            <option value="WiFi">📶 Wi-Fi & Internet</option>
            <option value="Noise">🤫 Noise & Silence</option>
            <option value="Cleanliness">🧹 Cleanliness & Hygiene</option>
            <option value="Facility">🪑 Facility & Desk / Chair</option>
            <option value="Lighting">💡 Lighting & Electrical</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 cursor-pointer transition-colors whitespace-nowrap"
              title="Reset all filters"
            >
              <X size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

