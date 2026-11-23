'use client';

import React from 'react';
import {
  CheckCircle,
  Filter,
  RotateCcw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';

interface SuperadminUsersDirectoryFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  roleFilter: 'all' | 'SuperAdmin' | 'Admin' | 'Manager';
  setRoleFilter: (val: 'all' | 'SuperAdmin' | 'Admin' | 'Manager') => void;
  statusFilter: 'all' | 'Active' | 'Suspended';
  setStatusFilter: (val: 'all' | 'Active' | 'Suspended') => void;
  twoFactorFilter: 'all' | 'enabled' | 'disabled';
  setTwoFactorFilter: (val: 'all' | 'enabled' | 'disabled') => void;
  branchFilter: string;
  setBranchFilter: (val: string) => void;
  availableBranches: string[];
  hasActiveFilters: boolean;
  resetAllFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export default function SuperadminUsersDirectoryFilterBar({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  twoFactorFilter,
  setTwoFactorFilter,
  branchFilter,
  setBranchFilter,
  availableBranches,
  hasActiveFilters,
  resetAllFilters,
  filteredCount,
  totalCount,
}: SuperadminUsersDirectoryFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-card/90 border border-border/80 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
          <input
            maxLength={100}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search user by name, username, email, phone, branch, role..."
            className="w-full rounded-xl border border-slate-700/60 bg-slate-950/70 pl-10 pr-9 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={14} className="text-rose-400" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex items-center">
            <Filter size={13} className="absolute left-2.5 text-purple-400 pointer-events-none" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              aria-label="Filter by role"
              className="rounded-xl border border-slate-700/60 bg-slate-950/70 pl-7 pr-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="SuperAdmin">SuperAdmin</option>
              <option value="Admin">Tenant Admin</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <div className="relative flex items-center">
            <CheckCircle size={13} className="absolute left-2.5 text-emerald-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              aria-label="Filter by status"
              className="rounded-xl border border-slate-700/60 bg-slate-950/70 pl-7 pr-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="relative flex items-center">
            <ShieldCheck size={13} className="absolute left-2.5 text-sky-400 pointer-events-none" />
            <select
              value={twoFactorFilter}
              onChange={(e) => setTwoFactorFilter(e.target.value as any)}
              aria-label="Filter by 2FA"
              className="rounded-xl border border-slate-700/60 bg-slate-950/70 pl-7 pr-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="all">All 2FA</option>
              <option value="enabled">2FA Enabled</option>
              <option value="disabled">2FA Disabled</option>
            </select>
          </div>

          {availableBranches.length > 0 && (
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              aria-label="Filter by branch"
              className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="all">All Branches</option>
              {availableBranches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
              title="Reset all active search and filters"
            >
              <RotateCcw size={12} className="text-rose-400" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/40">
        <span>
          Showing <strong className="text-white">{filteredCount}</strong> of {totalCount} accounts
        </span>
        {hasActiveFilters && <span className="text-indigo-400 font-medium">Filters Applied</span>}
      </div>
    </div>
  );
}
