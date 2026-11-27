'use client';

import type { AdminCommunicationWhatsappLog } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';
import { AlertCircle, CheckCheck, Clock, MessageSquare, RotateCcw, Search, Send } from 'lucide-react';
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
      selectedBox: 'bg-primary border-primary text-on-primary shadow-md',
      unselectedBox: 'bg-surface border-border text-text-secondary hover:bg-card-hover hover:text-text-primary',
      selectedBadge: 'bg-surface text-text-primary font-extrabold border-border',
      unselectedBadge: 'bg-card border-border text-text-secondary font-bold',
    },
    {
      id: 'Delivered',
      label: 'Delivered',
      count: visibleLogs.filter((l) => l.status === 'Delivered').length,
      icon: CheckCheck,
      selectedBox: 'bg-success border-success text-on-primary shadow-md',
      unselectedBox: 'bg-success-bg border-success text-success-text hover:opacity-90',
      selectedBadge: 'bg-surface text-text-primary font-extrabold border-border',
      unselectedBadge: 'bg-card border-success text-success-text font-bold',
    },
    {
      id: 'Sent',
      label: 'Sent',
      count: visibleLogs.filter((l) => l.status === 'Sent').length,
      icon: Send,
      selectedBox: 'bg-info border-info text-on-primary shadow-md',
      unselectedBox: 'bg-info-bg border-info text-info-text hover:opacity-90',
      selectedBadge: 'bg-surface text-text-primary font-extrabold border-border',
      unselectedBadge: 'bg-card border-info text-info-text font-bold',
    },
    {
      id: 'Pending',
      label: 'Pending',
      count: visibleLogs.filter((l) => l.status === 'Pending').length,
      icon: Clock,
      selectedBox: 'bg-warning border-warning text-on-primary shadow-md',
      unselectedBox: 'bg-warning-bg border-warning text-warning-text hover:opacity-90',
      selectedBadge: 'bg-surface text-text-primary font-extrabold border-border',
      unselectedBadge: 'bg-card border-warning text-warning-text font-bold',
    },
    {
      id: 'Failed',
      label: 'Failed',
      count: visibleLogs.filter((l) => l.status === 'Failed').length,
      icon: AlertCircle,
      selectedBox: 'bg-danger border-danger text-on-primary shadow-md',
      unselectedBox: 'bg-danger-bg border-danger text-danger-text hover:opacity-90',
      selectedBadge: 'bg-surface text-text-primary font-extrabold border-border',
      unselectedBadge: 'bg-card border-danger text-danger-text font-bold',
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-lg space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
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
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border motion-safe:transition-all cursor-pointer ${
                  isSelected ? st.selectedBox : st.unselectedBox
                }`}
              >
                <Icon size={14} className={isSelected ? 'text-on-primary' : 'opacity-90'} />
                <span>{st.label}</span>
                <span className={`inline-flex items-center justify-center min-w-[22px] px-1.5 py-0.5 rounded-lg text-[11px] font-mono border ${isSelected ? st.selectedBadge : st.unselectedBadge}`}>
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
            className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs text-danger-text hover:bg-danger-bg motion-safe:transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 items-end">
        <div className="flex flex-col">
          <label htmlFor="admin-communication-wa-type-filter" className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-text-secondary">
            {t('WHATSAPP_FILTER_TYPE')}
          </label>
          <select
            id="admin-communication-wa-type-filter"
            data-testid="admin_communication-page-control-009"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-xl border border-border bg-input py-2 px-3 text-xs text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="All">{t('WHATSAPP_TYPE_ALL')}</option>
            <option value="welcome">{t('WHATSAPP_TYPE_WELCOME')}</option>
            <option value="fee_reminder">{t('WHATSAPP_TYPE_FEE_REMINDER')}</option>
            <option value="receipt">{t('WHATSAPP_TYPE_RECEIPT')}</option>
            <option value="notice">{t('WHATSAPP_TYPE_NOTICE')}</option>
            <option value="renewal">{t('WHATSAPP_TYPE_RENEWAL')}</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="admin-communication-wa-status-filter" className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-text-secondary">
            {t('WHATSAPP_FILTER_STATUS')}
          </label>
          <select
            id="admin-communication-wa-status-filter"
            data-testid="admin_communication-page-control-010"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-border bg-input py-2 px-3 text-xs text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="All">{t('WHATSAPP_STATUS_ALL')}</option>
            <option value="Pending">{t('WHATSAPP_STATUS_PENDING')}</option>
            <option value="Sent">{t('WHATSAPP_STATUS_SENT')}</option>
            <option value="Delivered">{t('WHATSAPP_STATUS_DELIVERED')}</option>
            <option value="Failed">{t('WHATSAPP_STATUS_FAILED')}</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="admin-communication-wa-dispatch-mode" className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-text-secondary">
            Dispatch Mode
          </label>
          <select
            id="admin-communication-wa-dispatch-mode"
            value={dispatchModeFilter}
            onChange={(e) => setDispatchModeFilter(e.target.value)}
            className="w-full rounded-xl border border-border bg-input py-2 px-3 text-xs text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="All">All Dispatch Modes</option>
            <option value="auto_api_single">Server API (1x Auto)</option>
            <option value="manual_free_web">WhatsApp Web (Free)</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="admin-communication-wa-date-from" className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-text-secondary">
            {t('WHATSAPP_FILTER_FROM')}
          </label>
          <input
            maxLength={30}
            id="admin-communication-wa-date-from"
            type="date"
            className="w-full rounded-xl border border-border bg-input py-2 px-3 text-xs text-text-primary focus:border-primary focus:outline-none"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="admin-communication-wa-date-to" className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-text-secondary">
            {t('WHATSAPP_FILTER_TO')}
          </label>
          <input
            maxLength={30}
            id="admin-communication-wa-date-to"
            type="date"
            className="w-full rounded-xl border border-border bg-input py-2 px-3 text-xs text-text-primary focus:border-primary focus:outline-none"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="admin-communication-wa-log-search" className="block uppercase tracking-wider text-[11px] mb-1 font-semibold text-text-secondary">
            {t('WHATSAPP_FILTER_SEARCH')}
          </label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              maxLength={30}
              id="admin-communication-wa-log-search"
              className="w-full rounded-xl border border-border bg-input pl-8 pr-3 py-2 text-xs text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none"
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
