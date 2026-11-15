'use client';

import { Search, X, RotateCcw, Package, CheckCircle2, Wrench, Archive, Filter } from 'lucide-react';
import type { ManagerAssetsRegisterAsset } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';

interface ManagerAssetsRegisterToolbarProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  categoryLabel: (category: string) => string;
  counts: {
    all: number;
    active: number;
    maintenance: number;
    disposed: number;
  };
  onResetFilters: () => void;
}

export function ManagerAssetsRegisterToolbar({
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  categories,
  categoryLabel,
  counts,
  onResetFilters,
}: ManagerAssetsRegisterToolbarProps) {
  const isFiltered =
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    searchQuery.trim() !== '';

  const statusTabs = [
    {
      id: 'all',
      label: 'All Assets',
      count: counts.all,
      icon: Package,
      activeStyle: {
        boxShadow: '0 0 16px rgba(99, 102, 241, 0.45)',
        backgroundColor: '#6366f1',
        borderColor: '#818cf8',
        color: '#ffffff',
      },
    },
    {
      id: 'active',
      label: 'Active & Operational',
      count: counts.active,
      icon: CheckCircle2,
      activeStyle: {
        boxShadow: '0 0 16px rgba(16, 185, 129, 0.45)',
        backgroundColor: '#10b981',
        borderColor: '#34d399',
        color: '#ffffff',
      },
    },
    {
      id: 'maintenance',
      label: 'Under Maintenance',
      count: counts.maintenance,
      icon: Wrench,
      activeStyle: {
        boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
        backgroundColor: '#f59e0b',
        borderColor: '#fbbf24',
        color: '#000000',
      },
    },
    {
      id: 'disposed',
      label: 'Disposed',
      count: counts.disposed,
      icon: Archive,
      activeStyle: {
        boxShadow: '0 0 16px rgba(100, 116, 139, 0.45)',
        backgroundColor: '#64748b',
        borderColor: '#94a3b8',
        color: '#ffffff',
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-xs">
      {/* Top Row: Segmented Status Pills with Glowing Color Halo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onStatusChange(tab.id)}
                style={isActive ? tab.activeStyle : undefined}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border shadow-sm'
                    : 'bg-surface-highlight/70 text-secondary hover:text-primary hover:bg-surface-hover border border-border/80'
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                    isActive
                      ? tab.id === 'maintenance'
                        ? 'bg-black/20 text-black'
                        : 'bg-white/25 text-white'
                      : 'bg-muted text-secondary'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {isFiltered && (
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

      {/* Bottom Row: Search and Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input with non-overlapping padding and clear button */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search asset name, category, or location..."
            style={{ paddingLeft: '2.6rem', paddingRight: '2.25rem' }}
            className="w-full text-xs rounded-xl bg-card border border-border py-2 text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-primary rounded-md hover:bg-surface-hover transition-colors"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Dropdown Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-full sm:w-auto"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ManagerAssetsRegisterToolbar;
