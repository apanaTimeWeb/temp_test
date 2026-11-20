'use client';
// RESPONSIBILITY: Filter bar and search interface for Superadmin Billing Reports.

import React from 'react';
import { Search, X, Download, RotateCcw } from 'lucide-react';
import type { SuperadminAnalyticsBillingReportsFilters } from '../types/SuperadminAnalyticsBillingReportsTypes';
import { BILLING_REPORTS_DATE_RANGES } from '../constants/SuperadminAnalyticsBillingReportsConstants';

interface Props {
  filters: SuperadminAnalyticsBillingReportsFilters;
  searchInput: string;
  onSearchChange: (text: string) => void;
  onFilterChange: (key: keyof SuperadminAnalyticsBillingReportsFilters, val: unknown) => void;
  onResetFilters: () => void;
  onOpenExport: () => void;
  filterOptions?: {
    libraries: Array<{ id: string; name: string }>;
    branches: Array<{ id: string; name: string }>;
    plans: string[];
    paymentStatuses: string[];
    admins: Array<{ id: string; name: string }>;
  };
}

export function SuperadminAnalyticsBillingReportsFilterBar({
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
  const paymentStatuses = filterOptions?.paymentStatuses ?? ['PAID', 'PENDING', 'FAILED', 'REFUNDED', 'OVERDUE'];
  const admins = filterOptions?.admins ?? [];

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card/70 space-y-4 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0 max-w-lg">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by invoice number, library, transaction ID..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Search billing invoices"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Clear search input"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer active:scale-95"
            aria-label="Reset all billing filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={onOpenExport}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer shadow-sm active:scale-95"
            aria-label="Open export modal"
          >
            <Download size={14} />
            <span>Export & Print</span>
          </button>
        </div>
      </div>

      {/* 7 Structured Filter Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 pt-1 border-t border-border/40">
        {/* 1. Date Range */}
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
          <span>Date Range</span>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
            className="py-1.5 px-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {BILLING_REPORTS_DATE_RANGES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.value.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        {/* 2. Library */}
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
          <span>Library</span>
          <select
            value={filters.libraryId}
            onChange={(e) => onFilterChange('libraryId', e.target.value)}
            className="py-1.5 px-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Libraries</option>
            {libraries.map((lib) => (
              <option key={lib.id} value={lib.id}>{lib.name}</option>
            ))}
          </select>
        </label>

        {/* 3. Branch */}
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
          <span>Branch</span>
          <select
            value={filters.branchId}
            onChange={(e) => onFilterChange('branchId', e.target.value)}
            className="py-1.5 px-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </label>

        {/* 4. Plan */}
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
          <span>Plan</span>
          <select
            value={filters.plan}
            onChange={(e) => onFilterChange('plan', e.target.value)}
            className="py-1.5 px-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Plans</option>
            {plans.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>

        {/* 5. Status */}
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="py-1.5 px-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </label>

        {/* 6. Admin */}
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
          <span>Admin</span>
          <select
            value={filters.adminId}
            onChange={(e) => onFilterChange('adminId', e.target.value)}
            className="py-1.5 px-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Admins</option>
            {admins.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </label>

        {/* 7. Payment Status */}
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
          <span>Payment Status</span>
          <select
            value={filters.paymentStatus}
            onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
            className="py-1.5 px-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Payment Statuses</option>
            {paymentStatuses.map((ps) => (
              <option key={ps} value={ps}>{ps}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
