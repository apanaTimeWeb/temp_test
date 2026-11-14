'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Search, X, RotateCcw, Download } from 'lucide-react';
import {
  MANAGER_MEMBERSHIP_TYPE_OPTIONS,
  MANAGER_MEMBERS_GENDER_OPTIONS,
} from '@/app/frontend_manager/manager_members/members_directory/constants/ManagerMembersDirectoryConstants';

export interface ManagerMembersDirectoryFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  planFilter: string;
  setPlanFilter: (val: string) => void;
  shiftFilter: string;
  setShiftFilter: (val: string) => void;
  genderFilter: string;
  setGenderFilter: (val: string) => void;
  expiryFilter: string;
  setExpiryFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCsv?: () => void;
}

export function ManagerMembersDirectoryFilterBar({
  searchQuery,
  setSearchQuery,
  planFilter,
  setPlanFilter,
  shiftFilter,
  setShiftFilter,
  genderFilter,
  setGenderFilter,
  expiryFilter,
  setExpiryFilter,
  hasActiveFilters,
  onResetFilters,
  onExportCsv,
}: ManagerMembersDirectoryFilterBarProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');

  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-5 p-3 rounded-xl bg-surface border border-border w-full max-w-full min-w-0">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[180px] w-full sm:w-auto">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
        <label htmlFor="manager-members-search" className="sr-only">
          {tManagerUi('search_by_name_or_id')}
        </label>
        <input
          id="manager-members-search"
          type="search"
          className="mgr-input pl-9 text-xs w-full"
          placeholder="Search by name, ID, phone, email, seat..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Plan Filter */}
      <select
        aria-label="Filter by membership plan"
        value={planFilter}
        onChange={(e) => setPlanFilter(e.target.value)}
        className="rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer w-full sm:w-auto"
      >
        <option value="all">All Plans</option>
        {MANAGER_MEMBERSHIP_TYPE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {tManagerUi(opt.labelKey as any) || opt.value}
          </option>
        ))}
      </select>

      {/* Shift Filter */}
      <select
        aria-label="Filter by shift"
        value={shiftFilter}
        onChange={(e) => setShiftFilter(e.target.value)}
        className="rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer w-full sm:w-auto"
      >
        <option value="all">All Shifts</option>
        <option value="Morning">Morning Shift</option>
        <option value="Afternoon">Afternoon Shift</option>
        <option value="Evening">Evening Shift</option>
        <option value="Night">Night Shift</option>
        <option value="Full Day">Full Day</option>
      </select>

      {/* Gender Filter */}
      <select
        aria-label="Filter by gender"
        value={genderFilter}
        onChange={(e) => setGenderFilter(e.target.value)}
        className="rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer w-full sm:w-auto"
      >
        <option value="all">All Genders</option>
        {MANAGER_MEMBERS_GENDER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {tManagerUi(opt.labelKey as any) || opt.value}
          </option>
        ))}
      </select>

      {/* Expiry Filter */}
      <select
        aria-label="Filter by validity expiration"
        value={expiryFilter}
        onChange={(e) => setExpiryFilter(e.target.value)}
        className="rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer w-full sm:w-auto"
      >
        <option value="all">All Expiry Dates</option>
        <option value="7days">Expiring within 7 Days</option>
        <option value="30days">Expiring within 30 Days</option>
      </select>

      {/* Action buttons (Reset & Export CSV) */}
      <div className="flex items-center gap-2 sm:ml-auto">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/35 hover:text-rose-100 transition-all cursor-pointer shadow-sm shadow-rose-950/40"
            title="Clear all active filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}

        {onExportCsv && (
          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-400 motion-safe:transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Export Filtered Students List as CSV"
          >
            <Download size={14} className="text-indigo-400" />
            <span>Export CSV</span>
          </button>
        )}
      </div>
    </div>
  );
}
export default ManagerMembersDirectoryFilterBar;

