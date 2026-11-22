'use client';

import { Building,CreditCard,Download,RotateCcw,Search,Smartphone,Wallet,X } from 'lucide-react';

interface ManagerAccountsExpensesToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  modeFilter: string;
  setModeFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  searchedCount: number;
  totalCount: number;
  timeHorizonLabel: string;
  onExportCsv: () => void;
}

export function ManagerAccountsExpensesToolbar({
  searchQuery,
  setSearchQuery,
  modeFilter,
  setModeFilter,
  hasActiveFilters,
  onResetFilters,
  searchedCount,
  totalCount,
  timeHorizonLabel,
  onExportCsv,
}: ManagerAccountsExpensesToolbarProps) {
  const modeTabs = [
    {
      id: 'all',
      label: 'All Modes',
      icon: Wallet,
      activeStyle: {
        boxShadow: '0 0 16px rgba(99, 102, 241, 0.45)',
        backgroundColor: '#6366f1',
        borderColor: '#818cf8',
        color: '#ffffff',
      },
    },
    {
      id: 'cash',
      label: 'Cash (Counter)',
      icon: Wallet,
      activeStyle: {
        boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
        backgroundColor: '#10b981',
        borderColor: '#34d399',
        color: '#ffffff',
      },
    },
    {
      id: 'upi',
      label: 'UPI / QR',
      icon: Smartphone,
      activeStyle: {
        boxShadow: '0 0 16px rgba(14, 165, 233, 0.45)',
        backgroundColor: '#0ea5e9',
        borderColor: '#38bdf8',
        color: '#ffffff',
      },
    },
    {
      id: 'card',
      label: 'Card (POS)',
      icon: CreditCard,
      activeStyle: {
        boxShadow: '0 0 16px rgba(168, 85, 247, 0.45)',
        backgroundColor: '#a855f7',
        borderColor: '#c084fc',
        color: '#ffffff',
      },
    },
    {
      id: 'bank',
      label: 'Bank Transfer',
      icon: Building,
      activeStyle: {
        boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
        backgroundColor: '#f59e0b',
        borderColor: '#fbbf24',
        color: '#000000',
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-xs">
      {/* Top Row: Segmented Payment Mode Pills with Glowing Halos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {modeTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = modeFilter.toLowerCase() === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setModeFilter(tab.id)}
                style={isActive ? tab.activeStyle : undefined}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border shadow-sm font-bold'
                    : 'bg-surface-highlight/70 text-secondary hover:text-primary hover:bg-surface-hover border border-border/80'
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="self-end sm:self-auto inline-flex items-center gap-1.5 text-xs text-secondary hover:text-danger hover:bg-danger/10 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Reset all active filters"
          >
            <RotateCcw size={12} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Bottom Row: Non-Overlapping Search & CSV Export */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input with Guaranteed Non-Overlapping Icon & Clear Button */}
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search description, payee, or category..."
            style={{ paddingLeft: '2.5rem', paddingRight: '2.25rem' }}
            className="w-full text-xs rounded-xl bg-card border border-border py-2 text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none z-10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-primary rounded-md hover:bg-surface-hover transition-colors cursor-pointer z-10"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 justify-between md:justify-end">
          <span className="text-xs font-semibold text-secondary px-1 shrink-0">
            Showing <strong className="text-primary">{searchedCount}</strong> of {totalCount} records ({timeHorizonLabel})
          </span>

          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-all shadow-xs cursor-pointer shrink-0"
            title="Export Expenses as CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManagerAccountsExpensesToolbar;
