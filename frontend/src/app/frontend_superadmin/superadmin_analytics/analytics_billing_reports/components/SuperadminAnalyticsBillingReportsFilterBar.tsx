'use client';
// RESPONSIBILITY: Filter bar and search interface for Superadmin Billing Reports.

import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import type { SuperadminAnalyticsBillingReportsFilters } from '@/app/frontend_superadmin/superadmin_analytics/analytics_billing_reports/types/SuperadminAnalyticsBillingReportsTypes';
import { BILLING_REPORTS_DATE_RANGES } from '@/app/frontend_superadmin/superadmin_analytics/analytics_billing_reports/constants/SuperadminAnalyticsBillingReportsConstants';

interface Props {
  filters: SuperadminAnalyticsBillingReportsFilters;
  searchInput: string;
  onSearchChange: (text: string) => void;
  onFilterChange: (key: keyof SuperadminAnalyticsBillingReportsFilters, val: unknown) => void;
  onResetFilters: () => void;
  onOpenExport?: () => void;
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
  filterOptions,
}: Props) {
  const libraries = filterOptions?.libraries ?? [];
  const branches = filterOptions?.branches ?? [];
  const plans = filterOptions?.plans ?? ['Starter Plan', 'Professional Plan', 'Enterprise Elite', 'Multi-Branch Pro'];
  const paymentStatuses = filterOptions?.paymentStatuses ?? ['PAID', 'PENDING', 'FAILED', 'REFUNDED', 'OVERDUE'];
  const admins = filterOptions?.admins ?? [];

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-md space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0 max-w-lg">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input maxLength={30}
            type="text"
            placeholder="Search by invoice number, library, transaction ID..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-indigo-500/25 bg-slate-900/80 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
            aria-label="Search billing invoices"
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:text-white hover:bg-indigo-500/20 motion-safe:transition-all cursor-pointer active:scale-95 shadow-xs"
            aria-label="Reset all billing filters"
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* 7 Structured Filter Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 pt-3 border-t border-indigo-500/15">
        {/* 1. Date Range */}
        <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>Date Range</span>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
            className="py-1.5 px-2 rounded-xl border border-indigo-500/25 bg-slate-900/90 text-xs text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 cursor-pointer"
          >
            {BILLING_REPORTS_DATE_RANGES.map((d) => (
              <option key={d.value} value={d.value} className="bg-slate-950 text-white">
                {d.value.replace(/_/g, ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        {/* 2. Library */}
        <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>Library</span>
          <select
            value={filters.libraryId}
            onChange={(e) => onFilterChange('libraryId', e.target.value)}
            className="py-1.5 px-2 rounded-xl border border-indigo-500/25 bg-slate-900/90 text-xs text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950 text-white">All Libraries</option>
            {libraries.map((lib) => (
              <option key={lib.id} value={lib.id} className="bg-slate-950 text-white">{lib.name}</option>
            ))}
          </select>
        </label>

        {/* 3. Branch */}
        <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>Branch</span>
          <select
            value={filters.branchId}
            onChange={(e) => onFilterChange('branchId', e.target.value)}
            className="py-1.5 px-2 rounded-xl border border-indigo-500/25 bg-slate-900/90 text-xs text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950 text-white">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id} className="bg-slate-950 text-white">{b.name}</option>
            ))}
          </select>
        </label>

        {/* 4. Plan */}
        <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>Plan</span>
          <select
            value={filters.plan}
            onChange={(e) => onFilterChange('plan', e.target.value)}
            className="py-1.5 px-2 rounded-xl border border-indigo-500/25 bg-slate-900/90 text-xs text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950 text-white">All Plans</option>
            {plans.map((p) => (
              <option key={p} value={p} className="bg-slate-950 text-white">{p}</option>
            ))}
          </select>
        </label>

        {/* 5. Status */}
        <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="py-1.5 px-2 rounded-xl border border-indigo-500/25 bg-slate-900/90 text-xs text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950 text-white">All Statuses</option>
            <option value="ACTIVE" className="bg-slate-950 text-white">Active</option>
            <option value="SUSPENDED" className="bg-slate-950 text-white">Suspended</option>
            <option value="LOCKED" className="bg-slate-950 text-white">Locked</option>
          </select>
        </label>

        {/* 6. Admin */}
        <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>Admin</span>
          <select
            value={filters.adminId}
            onChange={(e) => onFilterChange('adminId', e.target.value)}
            className="py-1.5 px-2 rounded-xl border border-indigo-500/25 bg-slate-900/90 text-xs text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950 text-white">All Admins</option>
            {admins.map((adm) => (
              <option key={adm.id} value={adm.id} className="bg-slate-950 text-white">{adm.name}</option>
            ))}
          </select>
        </label>

        {/* 7. Payment Status */}
        <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>Payment</span>
          <select
            value={filters.paymentStatus}
            onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
            className="py-1.5 px-2 rounded-xl border border-indigo-500/25 bg-slate-900/90 text-xs text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950 text-white">All Payments</option>
            {paymentStatuses.map((st) => (
              <option key={st} value={st} className="bg-slate-950 text-white">{st}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
