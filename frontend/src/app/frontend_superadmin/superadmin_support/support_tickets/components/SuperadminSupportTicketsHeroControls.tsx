'use client';

import React from 'react';
import { Download, FileSpreadsheet, Printer, RotateCcw, Search, Ticket, X } from 'lucide-react';
import { SUPERADMIN_SUPPORT_TICKETS_FILTERS, SUPERADMIN_SUPPORT_TICKET_TYPES } from '@/app/frontend_superadmin/superadmin_support/support_tickets/constants/SuperadminSupportTicketsOverviewConstants';
import type { SuperadminSupportTicketsFilter } from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes';

interface SuperadminSupportTicketsHeroControlsProps {
  t: (key: string, values?: Record<string, string | number>) => string;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  priorityFilter: string;
  setPriorityFilter: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  filter: SuperadminSupportTicketsFilter;
  setFilter: (val: SuperadminSupportTicketsFilter) => void;
  hasActiveFilters: boolean;
  resetAllFilters: () => void;
  onOpenCreate: () => void;
  exportSampleTickets: () => void;
  exportSampleTicketsExcel: () => void;
  printTicketsRoster: () => void;
}

export default function SuperadminSupportTicketsHeroControls({
  t,
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  filter,
  setFilter,
  hasActiveFilters,
  resetAllFilters,
  onOpenCreate,
  exportSampleTickets,
  exportSampleTicketsExcel,
  printTicketsRoster,
}: SuperadminSupportTicketsHeroControlsProps) {
  return (
    <div className="space-y-4">
      {/* Hero Header */}
      <div className="rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-950/60 via-[#0a0d22] to-[#060810] p-5 sm:p-6 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold text-rose-300">
              <Ticket size={13} className="text-rose-400" />
              <span>SaaS Platform & Software Helpdesk</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">{t('COPY.SAAS_SUPPORT_HELPDESK')}</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Dedicated technical helpline for Library Owners, Admins & Managers — Software bugs, UPI payment issues, Biometric QR sync, and platform billing.
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={onOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-rose-950/40 hover:shadow-rose-500/30 hover:from-rose-500 hover:to-indigo-500 motion-safe:transition-all motion-safe:duration-200 active:scale-[0.97] cursor-pointer whitespace-nowrap shrink-0 group"
            >
              <div className="p-1 rounded-lg bg-white/20 text-white group-hover:scale-110 transition-transform">
                <Ticket size={14} strokeWidth={2.4} />
              </div>
              <span>Create Support Ticket</span>
            </button>
            <button
              type="button"
              onClick={exportSampleTicketsExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold motion-safe:transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0 active:scale-[0.97]"
              title="Download support tickets Excel table (.xls)"
            >
              <FileSpreadsheet size={14} className="text-emerald-400" />
              <span className="hidden md:inline">Export Excel</span>
            </button>
            <button
              type="button"
              onClick={printTicketsRoster}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold motion-safe:transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0 active:scale-[0.97]"
              title="Print support tickets roster"
            >
              <Printer size={14} className="text-indigo-400" />
              <span className="hidden md:inline">Print Roster</span>
            </button>
            <button
              type="button"
              onClick={exportSampleTickets}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold motion-safe:transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0 active:scale-[0.97]"
              title="Download sample CSV of visible tickets"
            >
              <Download size={14} className="text-slate-400" />
              <span className="hidden md:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-slate-800 bg-[#080d24]">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets by ID, subject, tenant, assignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-200 outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-200 outline-none cursor-pointer max-w-[140px] truncate"
          >
            <option value="all">All Categories</option>
            {SUPERADMIN_SUPPORT_TICKET_TYPES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as SuperadminSupportTicketsFilter)}
            className="text-xs rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-slate-200 outline-none cursor-pointer"
          >
            {SUPERADMIN_SUPPORT_TICKETS_FILTERS.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded-lg border border-rose-500/30 bg-rose-500/10 cursor-pointer"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
