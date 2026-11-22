'use client';

import { AlertCircle,CheckCircle2,Clock,Download,FileSpreadsheet,Layers,Printer,Search,X } from 'lucide-react';
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
  onExportExcel?: () => void;
  onPrint?: () => void;
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
  onExportExcel,
  onPrint,
  onResetPage,
}: ManagerCommunicationComplaintsToolbarProps) {
  const TAB_CONFIG: Record<
    string,
    {
      icon: typeof Layers;
      iconClass: string;
      activeBg: string;
      activeBorder: string;
      activeText: string;
      activeGlow: string;
      badgeBg: string;
      badgeText: string;
    }
  > = {
    All: {
      icon: Layers,
      iconClass: 'text-indigo-400',
      activeBg: 'rgba(99, 102, 241, 0.24)',
      activeBorder: '#6366f1',
      activeText: '#e0e7ff',
      activeGlow: '0 0 14px rgba(99, 102, 241, 0.45)',
      badgeBg: 'rgba(99, 102, 241, 0.45)',
      badgeText: '#ffffff',
    },
    Open: {
      icon: AlertCircle,
      iconClass: 'text-rose-400',
      activeBg: 'rgba(244, 63, 94, 0.25)',
      activeBorder: '#f43f5e',
      activeText: '#ffe4e6',
      activeGlow: '0 0 16px rgba(244, 63, 94, 0.5)',
      badgeBg: 'rgba(244, 63, 94, 0.5)',
      badgeText: '#ffffff',
    },
    'In-Progress': {
      icon: Clock,
      iconClass: 'text-amber-400',
      activeBg: 'rgba(245, 158, 11, 0.25)',
      activeBorder: '#f59e0b',
      activeText: '#fef3c7',
      activeGlow: '0 0 16px rgba(245, 158, 11, 0.5)',
      badgeBg: 'rgba(245, 158, 11, 0.5)',
      badgeText: '#ffffff',
    },
    Resolved: {
      icon: CheckCircle2,
      iconClass: 'text-emerald-400',
      activeBg: 'rgba(16, 185, 129, 0.25)',
      activeBorder: '#10b981',
      activeText: '#d1fae5',
      activeGlow: '0 0 16px rgba(16, 185, 129, 0.5)',
      badgeBg: 'rgba(16, 185, 129, 0.5)',
      badgeText: '#ffffff',
    },
  };

  return (
    <div className="flex flex-col gap-3.5 mb-5 p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-xs">
      {/* Top Row: Segmented Status Pills with Visual Glowing Color Fill When Clicked */}
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
                style={
                  isActive
                    ? {
                        backgroundColor: config.activeBg,
                        borderColor: config.activeBorder,
                        color: config.activeText,
                        boxShadow: config.activeGlow,
                      }
                    : undefined
                }
                className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer border ${
                  isActive
                    ? 'font-bold'
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
                  style={
                    isActive
                      ? {
                          backgroundColor: config.badgeBg,
                          color: config.badgeText,
                          borderColor: config.activeBorder,
                        }
                      : undefined
                  }
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold border transition-colors ${
                    isActive
                      ? ''
                      : 'bg-surface border-border text-secondary group-hover:text-primary'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Controls: Export CSV, Excel & Print */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {onPrint && (
            <button
              type="button"
              onClick={onPrint}
              className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold h-10 px-3.5 rounded-xl border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
              title="Print Complaints"
            >
              <Printer size={13} />
              <span>Print</span>
            </button>
          )}
          <button
            type="button"
            onClick={onExportCsv}
            className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold h-10 px-3.5 rounded-xl border border-border bg-card hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors cursor-pointer"
            title="Export Complaints CSV"
          >
            <Download size={13} />
            <span>CSV</span>
          </button>
          {onExportExcel && (
            <button
              type="button"
              onClick={onExportExcel}
              className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold h-10 px-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              title="Export Complaints Excel"
            >
              <FileSpreadsheet size={13} />
              <span>Excel</span>
            </button>
          )}
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
          <input maxLength={100}
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

