// RESPONSIBILITY: Category tabs, search bar, and grid/table view toggle.
import React from 'react';
import { Search, LayoutGrid, Table2 } from 'lucide-react';
import { SUPERADMIN_FEATURES_OVERVIEW_CONSTANTS } from '@/app/frontend_superadmin/superadmin_features/features_overview/constants/superadmin_features_overview.constants';

interface CategoryTabsProps {
  categoryFilter: string;
  searchQuery: string;
  viewMode: 'grid' | 'table';
  totalCount: number;
  filteredCount: number;
  onCategoryChange: (cat: string) => void;
  onSearchChange: (query: string) => void;
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

export default function SuperadminFeaturesOverviewCategoryTabs({
  categoryFilter,
  searchQuery,
  viewMode,
  totalCount,
  filteredCount,
  onCategoryChange,
  onSearchChange,
  onViewModeChange,
}: CategoryTabsProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 16 modules, endpoints, or descriptions..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-border bg-input text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-neutral-400">
            Showing {filteredCount} of {totalCount} modules
          </span>
          <div className="flex items-center p-0.5 rounded-lg border border-border bg-input">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-teal-500 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-teal-500 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Matrix Table View"
            >
              <Table2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SUPERADMIN_FEATURES_OVERVIEW_CONSTANTS.CATEGORIES.map((cat) => {
          const isActive = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-colors border ${
                isActive
                  ? 'bg-teal-500/15 border-teal-500/40 text-teal-300'
                  : 'border-border bg-card/60 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
