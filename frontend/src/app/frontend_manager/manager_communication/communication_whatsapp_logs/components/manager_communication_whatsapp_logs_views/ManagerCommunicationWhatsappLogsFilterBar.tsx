'use client';

import { Filter, RotateCw, Search, X } from 'lucide-react';
import type { WaLog } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/hooks/ManagerCommunicationWhatsappLogsDemoRepository';

interface ManagerCommunicationWhatsappLogsFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  typeFilter: string;
  setTypeFilter: (v: string) => void;
  channelFilter: string;
  setChannelFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  tManagerUi: (k: string) => string;
}

export function ManagerCommunicationWhatsappLogsFilterBar({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  channelFilter,
  setChannelFilter,
  statusFilter,
  setStatusFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  hasActiveFilters,
  onResetFilters,
  tManagerUi,
}: ManagerCommunicationWhatsappLogsFilterBarProps) {
  return (
    <div className="mgr-card p-4 border border-border bg-card space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="relative lg:col-span-2">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            className="mgr-input pl-9 pr-3 py-2 text-xs w-full rounded-xl bg-surface/50 border border-border focus:border-primary"
            placeholder="Search student or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <select
            className="mgr-input py-2 px-3 text-xs w-full rounded-xl bg-surface/50 border border-border focus:border-primary"
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            aria-label="Filter by Channel / Dispatch Mode"
          >
            <option value="All">All Dispatch Modes</option>
            <option value="Server API (1x Auto)">Server API (1x Auto)</option>
            <option value="WhatsApp Web (Free)">WhatsApp Web (Free)</option>
          </select>
        </div>

        <div>
          <select
            className="mgr-input py-2 px-3 text-xs w-full rounded-xl bg-surface/50 border border-border focus:border-primary"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by Type"
          >
            <option value="All">{tManagerUi('all_types')}</option>
            <option value="welcome">{tManagerUi('welcome')}</option>
            <option value="fee_reminder">{tManagerUi('fee_reminder')}</option>
            <option value="receipt">{tManagerUi('receipt')}</option>
            <option value="notice">{tManagerUi('notice')}</option>
            <option value="renewal">{tManagerUi('renewal')}</option>
          </select>
        </div>

        <div>
          <select
            className="mgr-input py-2 px-3 text-xs w-full rounded-xl bg-surface/50 border border-border focus:border-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Status"
          >
            <option value="All">{tManagerUi('all_statuses')}</option>
            <option value="Delivered">{tManagerUi('delivered')}</option>
            <option value="Sent">{tManagerUi('sent')}</option>
            <option value="Pending">{tManagerUi('pending')}</option>
            <option value="Failed">{tManagerUi('failed')}</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer w-full justify-center"
            >
              <RotateCw size={13} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
