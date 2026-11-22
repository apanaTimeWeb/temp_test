'use client';

import type { AdminCommunicationWhatsappLog } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';
import { AlertCircle,CheckCheck,Clock,MessageSquare,RotateCcw,Search,Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface AdminCommunicationWhatsappLogsFilterBarProps {
  visibleLogs: readonly AdminCommunicationWhatsappLog[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  dispatchModeFilter: string;
  setDispatchModeFilter: (mode: string) => void;
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
  searchInput: string;
  setSearchInput: (query: string) => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
}

export function AdminCommunicationWhatsappLogsFilterBar({
  visibleLogs,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  dispatchModeFilter,
  setDispatchModeFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  searchInput,
  setSearchInput,
  hasActiveFilters,
  clearAllFilters,
}: AdminCommunicationWhatsappLogsFilterBarProps) {
  const t = useTranslations('ADMIN_COMMUNICATION');

  const statusChips = [
    {
      id: 'All',
      label: 'All Statuses',
      count: visibleLogs.length,
      icon: MessageSquare,
      selectedBox: 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-950/50',
      unselectedBox: 'bg-indigo-950/50 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/60',
      selectedBadge: 'bg-white text-indigo-950 font-extrabold shadow-xs',
      unselectedBadge: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200 font-bold',
    },
    {
      id: 'Delivered',
      label: 'Delivered',
      count: visibleLogs.filter((l) => l.status === 'Delivered').length,
      icon: CheckCheck,
      selectedBox: 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-950/50',
      unselectedBox: 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60',
      selectedBadge: 'bg-white text-emerald-950 font-extrabold shadow-xs',
      unselectedBadge: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200 font-bold',
    },
    {
      id: 'Sent',
      label: 'Sent',
      count: visibleLogs.filter((l) => l.status === 'Sent').length,
      icon: Send,
      selectedBox: 'bg-sky-600 border-sky-400 text-white shadow-md shadow-sky-950/50',
      unselectedBox: 'bg-sky-950/50 border-sky-500/30 text-sky-300 hover:bg-sky-900/60',
      selectedBadge: 'bg-white text-sky-950 font-extrabold shadow-xs',
      unselectedBadge: 'bg-sky-500/20 border-sky-400/40 text-sky-200 font-bold',
    },
    {
      id: 'Pending',
      label: 'Pending',
      count: visibleLogs.filter((l) => l.status === 'Pending').length,
      icon: Clock,
      selectedBox: 'bg-amber-600 border-amber-400 text-white shadow-md shadow-amber-950/50',
      unselectedBox: 'bg-amber-950/50 border-amber-500/30 text-amber-300 hover:bg-amber-900/60',
      selectedBadge: 'bg-white text-amber-950 font-extrabold shadow-xs',
      unselectedBadge: 'bg-amber-500/20 border-amber-400/40 text-amber-200 font-bold',
    },
    {
      id: 'Failed',
      label: 'Failed',
      count: visibleLogs.filter((l) => l.status === 'Failed').length,
      icon: AlertCircle,
      selectedBox: 'bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-950/50',
      unselectedBox: 'bg-rose-950/50 border-rose-500/30 text-rose-300 hover:bg-rose-900/60',
      selectedBadge: 'bg-white text-rose-950 font-extrabold shadow-xs',
      unselectedBadge: 'bg-rose-500/20 border-rose-400/40 text-rose-200 font-bold',
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md space-y-4">
      {/* Quick Status Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {statusChips.map((st) => {
            const isSelected = statusFilter === st.id;
            const Icon = st.icon;
            return (
              <button
                key={st.id}
                type="button"
                data-testid={`admin_communication-status-filter-${st.id.toLowerCase()}`}
                onClick={() => setStatusFilter(st.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected ? st.selectedBox : st.unselectedBox
                }`}
              >
                <Icon size={14} className={isSelected ? 'text-white' : 'opacity-90'} />
                <span>{st.label}</span>
                <span
                  className={`inline-flex items-center justify-center min-w-[22px] px-1.5 py-0.5 rounded-lg text-[11px] font-mono border ${
                    isSelected ? st.selectedBadge : st.unselectedBadge
                  }`}
                >
                  {st.count}
                </span>
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Detailed Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 items-end">
        {/* Type Filter */}
        <div className="flex flex-col">
          <label htmlFor="admin-communication-wa-type-filter" className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-slate-400">
            {t('WHATSAPP_FILTER_TYPE')}
          </label>
          <select
            id="admin-communication-wa-type-filter"
            data-testid="admin_communication-page-control-009"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="All">{t('WHATSAPP_TYPE_ALL')}</option>
            <option value="welcome">{t('WHATSAPP_TYPE_WELCOME')}</option>
            <option value="fee_reminder">{t('WHATSAPP_TYPE_FEE_REMINDER')}</option>
            <option value="receipt">{t('WHATSAPP_TYPE_RECEIPT')}</option>
            <option value="notice">{t('WHATSAPP_TYPE_NOTICE')}</option>
            <option value="renewal">{t('WHATSAPP_TYPE_RENEWAL')}</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col">
          <label htmlFor="admin-communication-wa-status-filter" className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-slate-400">
            {t('WHATSAPP_FILTER_STATUS')}
          </label>
          <select
            id="admin-communication-wa-status-filter"
            data-testid="admin_communication-page-control-010"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="All">{t('WHATSAPP_STATUS_ALL')}</option>
            <option value="Pending">{t('WHATSAPP_STATUS_PENDING')}</option>
            <option value="Sent">{t('WHATSAPP_STATUS_SENT')}</option>
            <option value="Delivered">{t('WHATSAPP_STATUS_DELIVERED')}</option>
            <option value="Failed">{t('WHATSAPP_STATUS_FAILED')}</option>
          </select>
        </div>

        {/* Dispatch Mode Filter */}
        <div className="flex flex-col">
          <label htmlFor="admin-communication-wa-dispatch-mode" className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-slate-400">
            Dispatch Mode
          </label>
          <select
            id="admin-communication-wa-dispatch-mode"
            value={dispatchModeFilter}
            onChange={(e) => setDispatchModeFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="All">All Dispatch Modes</option>
            <option value="auto_api_single">Server API (1x Auto)</option>
            <option value="manual_free_web">WhatsApp Web (Free)</option>
          </select>
        </div>

        {/* Date From */}
        <div className="flex flex-col">
          <label htmlFor="admin-communication-wa-date-from" className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-slate-400">
            {t('WHATSAPP_FILTER_FROM')}
          </label>
          <input maxLength={30}
            id="admin-communication-wa-date-from"
            type="date"
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="flex flex-col">
          <label htmlFor="admin-communication-wa-date-to" className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-slate-400">
            {t('WHATSAPP_FILTER_TO')}
          </label>
          <input maxLength={30}
            id="admin-communication-wa-date-to"
            type="date"
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        {/* Search Box */}
        <div className="flex flex-col">
          <label htmlFor="admin-communication-wa-log-search" className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-slate-400">
            {t('WHATSAPP_FILTER_SEARCH')}
          </label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input maxLength={30}
              id="admin-communication-wa-log-search"
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              placeholder={t('WHATSAPP_FILTER_SEARCH_PLACEHOLDER')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminCommunicationWhatsappLogsFilterBar;
