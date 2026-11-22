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
    <div className="p-4 sm:p-5 rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-xl shadow-xl space-y-3.5">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input maxLength={100}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 16 modules, endpoints, or descriptions..."
            className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-indigo-500/25 bg-slate-950/80 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          />
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{filteredCount}</strong> of {totalCount} modules
          </span>
          <div className="flex items-center p-1 rounded-xl border border-indigo-500/25 bg-slate-950/80 shadow-xs">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-teal-500 text-slate-950 shadow-sm shadow-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-teal-500 text-slate-950 shadow-sm shadow-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Matrix Table View"
            >
              <Table2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {SUPERADMIN_FEATURES_OVERVIEW_CONSTANTS.CATEGORIES.map((cat) => {
          const isActive = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 text-xs rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/25'
                  : 'border-indigo-500/20 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60'
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