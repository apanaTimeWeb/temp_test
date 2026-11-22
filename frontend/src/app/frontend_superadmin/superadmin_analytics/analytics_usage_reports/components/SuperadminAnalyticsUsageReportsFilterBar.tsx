'use client';
// RESPONSIBILITY: Filter bar and search interface for Superadmin Usage Reports.
// CONTROLS: 7 Required Filters (Date Range, Library, Branch, Plan, Status, Admin, Payment Status) + Search.

import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import type { SuperadminAnalyticsUsageReportsFilters } from '../types/SuperadminAnalyticsUsageReportsTypes';
import {
  USAGE_REPORTS_DATE_RANGES,
  USAGE_PLAN_OPTIONS,
  USAGE_STATUS_OPTIONS,
  USAGE_PAYMENT_STATUS_OPTIONS,
} from '../constants/SuperadminAnalyticsUsageReportsConstants';

interface Props {
  filters: SuperadminAnalyticsUsageReportsFilters;
  searchInput: string;
  onSearchChange: (text: string) => void;
  onFilterChange: (key: keyof SuperadminAnalyticsUsageReportsFilters, val: unknown) => void;
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

export function SuperadminAnalyticsUsageReportsFilterBar({
  filters,
  searchInput,
  onSearchChange,
  onFilterChange,
  onResetFilters,
  filterOptions,
}: Props) {
  const libraries = filterOptions?.libraries ?? [];
  const branches = filterOptions?.branches ?? [];
  const plans = filterOptions?.plans ?? (USAGE_PLAN_OPTIONS as unknown as string[]);
  const statuses = filterOptions?.statuses ?? (USAGE_STATUS_OPTIONS as unknown as string[]);
  const paymentStatuses = filterOptions?.paymentStatuses ?? (USAGE_PAYMENT_STATUS_OPTIONS as unknown as string[]);
  const admins = filterOptions?.admins ?? [];

  return (
    <div
      className="p-4 sm:p-5 rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-md space-y-4 shadow-xl"
      data-testid="usage-reports-filter-bar"
    >
      {/* ── Search & Action Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input maxLength={100}
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by library, branch, admin name, code..."
            data-testid="usage-search-input"
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-indigo-500/25 bg-slate-900/80 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:text-white hover:bg-indigo-500/20 transition-all cursor-pointer active:scale-95 shadow-xs"
            title="Reset all filters"
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* ── 7 Filter Select Dropdowns ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-3 border-t border-indigo-500/15">
        {/* 1. Date Range */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-indigo-500/25 bg-slate-900/90 text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 cursor-pointer"
          >
            {USAGE_REPORTS_DATE_RANGES.map((d) => (
              <option key={d.value} value={d.value} className="bg-slate-950 text-white">{d.label}</option>
            ))}
          </select>
        </div>

        {/* 2. Library */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Library</label>
          <select
            value={filters.libraryId}
            onChange={(e) => onFilterChange('libraryId', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-indigo-500/25 bg-slate-900/90 text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950 text-white">All Libraries</option>
            {libraries.map((l) => (
              <option key={l.id} value={l.id} className="bg-slate-950 text-white">{l.name}</option>
            ))}
          </select>
        </div>

        {/* 3. Branch */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Branch</label>
          <select
            value={filters.branchId}
            onChange={(e) => onFilterChange('branchId', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-indigo-500/25 bg-slate-900/90 text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950 text-white">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id} className="bg-slate-950 text-white">{b.name}</option>
            ))}
          </select>
        </div>

        {/* 4. Plan */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Plan</label>
          <select
            value={filters.plan}
            onChange={(e) => onFilterChange('plan', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-indigo-500/25 bg-slate-900/90 text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950 text-white">All Plans</option>
            {plans.filter((p) => p !== 'ALL').map((p) => (
              <option key={p} value={p} className="bg-slate-950 text-white">{p}</option>
            ))}
          </select>
        </div>

        {/* 5. Status */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-indigo-500/25 bg-slate-900/90 text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950 text-white">All Statuses</option>
            {statuses.filter((s) => s !== 'ALL').map((s) => (
              <option key={s} value={s} className="bg-slate-950 text-white">{s}</option>
            ))}
          </select>
        </div>

        {/* 6. Admin */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Admin</label>
          <select
            value={filters.adminId}
            onChange={(e) => onFilterChange('adminId', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-indigo-500/25 bg-slate-900/90 text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950 text-white">All Admins</option>
            {admins.map((a) => (
              <option key={a.id} value={a.id} className="bg-slate-950 text-white">{a.name}</option>
            ))}
          </select>
        </div>

        {/* 7. Payment Status */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment</label>
          <select
            value={filters.paymentStatus}
            onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-indigo-500/25 bg-slate-900/90 text-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950 text-white">All Payments</option>
            {paymentStatuses.filter((ps) => ps !== 'ALL').map((ps) => (
              <option key={ps} value={ps} className="bg-slate-950 text-white">{ps}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
