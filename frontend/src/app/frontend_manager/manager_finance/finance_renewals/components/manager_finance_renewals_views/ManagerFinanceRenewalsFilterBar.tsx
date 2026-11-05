'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { MANAGER_FINANCE_RENEWAL_FILTERS } from '@/app/frontend_manager/manager_finance/finance_renewals/constants/ManagerFinanceRenewalsRenewalConstants';
import type { FilterType } from '@/app/frontend_manager/manager_finance/finance_renewals/types/ManagerFinanceRenewalsComponentTypes';

export interface ManagerFinanceRenewalsFilterBarProps {
  filter: FilterType;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  shiftFilter: string;
  onShiftFilterChange: (s: string) => void;
  planFilter: string;
  onPlanFilterChange: (p: string) => void;
  dueFilter: string;
  onDueFilterChange: (d: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  searchedCount: number;
  totalVisibleCount: number;
  tManagerUi: (k: string) => string;
}

export default function ManagerFinanceRenewalsFilterBar({
  filter,
  onFilterChange,
  searchQuery,
  onSearchQueryChange,
  shiftFilter,
  onShiftFilterChange,
  planFilter,
  onPlanFilterChange,
  dueFilter,
  onDueFilterChange,
  onResetFilters,
  hasActiveFilters,
  searchedCount,
  totalVisibleCount,
  tManagerUi,
}: ManagerFinanceRenewalsFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      <div className="flex gap-2 flex-wrap items-center">
        {MANAGER_FINANCE_RENEWAL_FILTERS.map((f) => (
          <button
            type="button"
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={filter === f.value ? 'fin-badge fin-badge--info cursor-pointer' : 'fin-badge fin-badge--neutral cursor-pointer'}
          >
            {f.emoji} {tManagerUi(f.labelKey)}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search student, smart ID, or plan..."
            className="mgr-input pl-8 text-xs w-full"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
        </div>

        <select
          aria-label="Filter by Shift"
          value={shiftFilter}
          onChange={(e) => onShiftFilterChange(e.target.value)}
          className="mgr-select text-xs py-1.5 px-3 min-w-[110px]"
        >
          <option value="all">All Shifts</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Full Day">Full Day</option>
        </select>

        <select
          aria-label="Filter by Plan"
          value={planFilter}
          onChange={(e) => onPlanFilterChange(e.target.value)}
          className="mgr-select text-xs py-1.5 px-3 min-w-[110px]"
        >
          <option value="all">All Plans</option>
          <option value="Basic">Basic</option>
          <option value="Premium">Premium</option>
          <option value="Elite">Elite</option>
        </select>

        <select
          aria-label="Filter by Balance Due"
          value={dueFilter}
          onChange={(e) => onDueFilterChange(e.target.value)}
          className="mgr-select text-xs py-1.5 px-3 min-w-[110px]"
        >
          <option value="all">All Dues</option>
          <option value="due_only">Has Due Balance</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
            title="Reset all filters"
          >
            <X size={13} /> Reset
          </button>
        )}

        <span className="mgr-badge mgr-badge--info font-mono text-xs shrink-0">
          {searchedCount} of {totalVisibleCount}
        </span>
      </div>
    </div>
  );
}

