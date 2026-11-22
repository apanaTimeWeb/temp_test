'use client';
// RESPONSIBILITY: Filter bar and search interface for Superadmin Platform Reports.

import React from 'react';
import { Search, Calendar, Filter, X, Download, RotateCcw } from 'lucide-react';
import type { SuperadminAnalyticsPlatformReportsFilters } from '../types/SuperadminAnalyticsPlatformReportsTypes';
import { PLATFORM_REPORTS_DATE_RANGES } from '../constants/SuperadminAnalyticsPlatformReportsConstants';

interface Props {
  filters: SuperadminAnalyticsPlatformReportsFilters;
  searchInput: string;
  onSearchChange: (text: string) => void;
  onFilterChange: (key: keyof SuperadminAnalyticsPlatformReportsFilters, val: unknown) => void;
  onResetFilters: () => void;
  onOpenExport?: () => void;
  filterOptions?: {
    libraries: Array<{ id: string; name: string }>;
    branches: Array<{ id: string; name: string }>;
    plans: string[];
    statuses: string[];
    paymentStatuses: string[];
    admins: Array<{ id: string; name: string }>;
  };
}

export function SuperadminAnalyticsPlatformReportsFilterBar({
  filters,
  searchInput,
  onSearchChange,
  onFilterChange,
  onResetFilters,
  onOpenExport,
  filterOptions,
}: Props) {
  const libraries = filterOptions?.libraries ?? [];
  const branches = filterOptions?.branches ?? [];
  const plans = filterOptions?.plans ?? ['Starter Plan', 'Professional Plan', 'Enterprise Elite', 'Multi-Branch Pro'];
  const statuses = filterOptions?.statuses ?? ['ACTIVE', 'SUSPENDED', 'INACTIVE', 'CHURNED'];
  const paymentStatuses = filterOptions?.paymentStatuses ?? ['PAID', 'PENDING', 'FAILED', 'OVERDUE'];
  const admins = filterOptions?.admins ?? [];

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0 max-w-lg">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none" />
          <input maxLength={30}
            type="text"
            placeholder="Search by library name, code, admin, city..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-900/90 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            aria-label="Search platform records"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              aria-label="Clear search input"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Action Controls: Reset */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-indigo-500/25 bg-slate-900/90 text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer active:scale-95 shadow-xs"
            aria-label="Reset all filters"
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Structured Filter Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 pt-3 border-t border-indigo-500/20">
        {/* 1. Date Range */}
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-slate-400">
          <span>Date Range</span>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
            className="py-1.5 px-2 rounded-lg border border-indigo-500/30 bg-slate-900/90 text-xs text-white focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            {PLATFORM_REPORTS_DATE_RANGES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.value.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        {/* 2. Library */}
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-slate-400">
          <span>Library</span>
          <select
            value={filters.libraryId}
            onChange={(e) => onFilterChange('libraryId', e.target.value)}
            className="py-1.5 px-2 rounded-lg border border-indigo-500/30 bg-slate-900/90 text-xs text-white focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            <option value="ALL">All Libraries</option>
            {libraries.map((lib) => (
              <option key={lib.id} value={lib.id}>
                {lib.name}
              </option>
            ))}
          </select>
        </label>

        {/* 3. Branch */}
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-slate-400">
          <span>Branch</span>
          <select
            value={filters.branchId}
            onChange={(e) => onFilterChange('branchId', e.target.value)}
            className="py-1.5 px-2 rounded-lg border border-indigo-500/30 bg-slate-900/90 text-xs text-white focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            <option value="ALL">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>

        {/* 4. Plan */}
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-slate-400">
          <span>Plan</span>
          <select
            value={filters.plan}
            onChange={(e) => onFilterChange('plan', e.target.value)}
            className="py-1.5 px-2 rounded-lg border border-indigo-500/30 bg-slate-900/90 text-xs text-white focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            <option value="ALL">All Plans</option>
            {plans.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        {/* 5. Status */}
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-slate-400">
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="py-1.5 px-2 rounded-lg border border-indigo-500/30 bg-slate-900/90 text-xs text-white focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        {/* 6. Admin */}
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-slate-400">
          <span>Admin</span>
          <select
            value={filters.adminId}
            onChange={(e) => onFilterChange('adminId', e.target.value)}
            className="py-1.5 px-2 rounded-lg border border-indigo-500/30 bg-slate-900/90 text-xs text-white focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            <option value="ALL">All Admins</option>
            {admins.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        {/* 7. Payment Status */}
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-slate-400">
          <span>Payment Status</span>
          <select
            value={filters.paymentStatus}
            onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
            className="py-1.5 px-2 rounded-lg border border-indigo-500/30 bg-slate-900/90 text-xs text-white focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            <option value="ALL">All Payments</option>
            {paymentStatuses.map((ps) => (
              <option key={ps} value={ps}>
                {ps}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
