// components/SuperadminUsageQuotaRequestsFilters.tsx
// RESPONSIBILITY: Render search and filter controls for quota upgrade requests.
import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { useSuperadminUsageQuotaRequestsStore } from '../state/useSuperadminUsageQuotaRequestsStore';
import {
  QUOTA_FILTER_STATUS_OPTIONS,
  QUOTA_FILTER_RESOURCE_OPTIONS,
} from '../constants/SuperadminUsageQuotaRequestsConstants';
import type {
  QuotaRequestStatus,
  QuotaRequestResourceType,
} from '../types/SuperadminUsageQuotaRequestsTypes';

export function SuperadminUsageQuotaRequestsFilters() {
  const {
    search,
    status,
    resourceType,
    setSearch,
    setStatus,
    setResourceType,
    resetFilters,
  } = useSuperadminUsageQuotaRequestsStore();

  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 p-4 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by library name, reason, or submitter..."
          className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'ALL' | QuotaRequestStatus)}
          className="rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors cursor-pointer"
        >
          {QUOTA_FILTER_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value as 'ALL' | QuotaRequestResourceType)}
          className="rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors cursor-pointer"
        >
          {QUOTA_FILTER_RESOURCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={resetFilters}
          title="Reset Filters"
          className="rounded-xl border border-indigo-500/25 bg-slate-950/80 p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}