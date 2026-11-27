'use client';

import { Search, X } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface ManagerFinanceFinesPaymentsTableFilterBarProps {
  searchQuery: string;
  searchPlaceholder: string;
  maxLength?: number;
  selectAriaLabel: string;
  selectValue: string;
  selectOptions: FilterOption[];
  hasActiveFilter: boolean;
  summaryText: string;
  filteredCount: number;
  onSearchChange: (val: string) => void;
  onSelectChange: (val: string) => void;
  onReset: () => void;
}

export default function ManagerFinanceFinesPaymentsTableFilterBar({
  searchQuery,
  searchPlaceholder,
  maxLength = 30,
  selectAriaLabel,
  selectValue,
  selectOptions,
  hasActiveFilter,
  summaryText,
  filteredCount,
  onSearchChange,
  onSelectChange,
  onReset,
}: ManagerFinanceFinesPaymentsTableFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border">
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          <input
            maxLength={maxLength}
            type="text"
            placeholder={searchPlaceholder}
            className="mgr-input !pl-10 !pr-9 text-xs w-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer p-0.5"
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <select
          aria-label={selectAriaLabel}
          value={selectValue}
          onChange={(e) => onSelectChange(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary hover:border-primary shadow-xs cursor-pointer w-full sm:w-auto min-w-[130px] outline-none"
        >
          {selectOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer motion-safe:transition-colors"
            title="Reset filters"
          >
            <X size={13} /> Reset
          </button>
        )}
      </div>

      <div className="text-xs text-secondary font-medium shrink-0 flex items-center gap-1.5">
        <span>Showing</span>
        <span className="font-bold text-primary">{filteredCount}</span>
        <span>{summaryText}</span>
      </div>
    </div>
  );
}
