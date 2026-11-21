'use client';
// RESPONSIBILITY: Filter bar and search interface for Superadmin Usage Reports.
// CONTROLS: 7 Required Filters (Date Range, Library, Branch, Plan, Status, Admin, Payment Status) + Search.

import React from 'react';
import { Search, X, Download, RotateCcw } from 'lucide-react';
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
  onOpenExport: () => void;
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
  onOpenExport,
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
      className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xs space-y-4 shadow-xs"
      data-testid="usage-reports-filter-bar"
    >
      {/* ── Search & Primary Action Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by library, branch, admin name, code..."
            data-testid="usage-search-input"
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all text-foreground"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title="Reset all filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            data-testid="usage-export-trigger-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Download size={13} />
            <span>Export & Print</span>
          </button>
        </div>
      </div>

      {/* ── 7 Filter Select Dropdowns ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1 border-t border-border/40">
        {/* 1. Date Range */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            {USAGE_REPORTS_DATE_RANGES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* 2. Library */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Library</label>
          <select
            value={filters.libraryId}
            onChange={(e) => onFilterChange('libraryId', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            <option value="ALL">All Libraries</option>
            {libraries.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>

        {/* 3. Branch */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Branch</label>
          <select
            value={filters.branchId}
            onChange={(e) => onFilterChange('branchId', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            <option value="ALL">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* 4. Plan */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Plan</label>
          <select
            value={filters.plan}
            onChange={(e) => onFilterChange('plan', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            <option value="ALL">All Plans</option>
            {plans.filter((p) => p !== 'ALL').map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* 5. Status */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            {statuses.filter((s) => s !== 'ALL').map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* 6. Admin */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Admin</label>
          <select
            value={filters.adminId}
            onChange={(e) => onFilterChange('adminId', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            <option value="ALL">All Admins</option>
            {admins.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* 7. Payment Status */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Payment Status</label>
          <select
            value={filters.paymentStatus}
            onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            <option value="ALL">All Payments</option>
            {paymentStatuses.filter((ps) => ps !== 'ALL').map((ps) => (
              <option key={ps} value={ps}>{ps}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
