// RESPONSIBILITY: Render search, plan filter, and category tabs for usage overview table.
import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { useSuperadminUsageOverviewStore } from '../state/useSuperadminUsageOverviewStore';
import { USAGE_CATEGORY_TABS } from '../constants/SuperadminUsageOverviewConstants';

export function SuperadminUsageOverviewFilters() {
  const {
    search,
    planTier,
    categoryTab,
    setSearch,
    setPlanTier,
    setCategoryTab,
    resetFilters,
  } = useSuperadminUsageOverviewStore();

  return (
    <div className="space-y-3">
      {/* ── Category Segmented Control ── */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 pb-2.5">
        {USAGE_CATEGORY_TABS.map((tab) => {
          const isActive = categoryTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCategoryTab(tab.id as typeof categoryTab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Search and Dropdown Controls ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search library name or plan..."
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={planTier}
            onChange={(e) => setPlanTier(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="ALL">All Plan Tiers</option>
            <option value="Basic">Basic Plan</option>
            <option value="Pro">Pro Plan</option>
            <option value="Enterprise">Enterprise Plan</option>
          </select>

          <button
            onClick={resetFilters}
            title="Reset Filters"
            className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
