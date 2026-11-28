'use client';

import '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_styles/ManagerAssetsRegisterStyles.css';
import { Archive,CheckCircle2,Package,RotateCcw,Search,Wrench,X } from 'lucide-react';

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
    { id: 'all', label: 'All Assets', count: counts.all, icon: Package, activeClass: 'mar-pill-indigo-active' },
    { id: 'active', label: 'Active & Operational', count: counts.active, icon: CheckCircle2, activeClass: 'mar-pill-active-state' },
    { id: 'maintenance', label: 'Under Maintenance', count: counts.maintenance, icon: Wrench, activeClass: 'mar-pill-maintenance-state' },
    { id: 'disposed', label: 'Disposed', count: counts.disposed, icon: Archive, activeClass: 'mar-pill-disposed-state' },
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
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? `${tab.activeClass} border shadow-sm`
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
            className="self-end sm:self-auto inline-flex items-center gap-1.5 text-xs text-secondary hover:text-danger hover:bg-danger-bg px-2.5 py-1.5 rounded-lg motion-safe:transition-colors cursor-pointer"
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
        <div className="relative flex-1 flex items-center">
          <input maxLength={100}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search asset name, category, or location..."
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
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-primary rounded-md hover:bg-surface-hover transition-colors z-10"
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
