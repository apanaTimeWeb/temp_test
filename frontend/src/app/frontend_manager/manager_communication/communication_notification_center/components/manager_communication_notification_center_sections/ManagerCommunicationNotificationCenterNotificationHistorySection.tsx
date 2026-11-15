'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Mail,
  MessageSquare,
  Smartphone,
  Search,
  X,
  Download,
  Printer,
  CheckCheck,
  AlertCircle,
  Clock,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

import ManagerCommunicationNotificationCenterNativeTable, {
  type NativeColumn,
  type NativeCellParams,
} from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_table_parts/ManagerCommunicationNotificationCenterNativeTable';
import { MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY } from '@/app/frontend_manager/manager_communication/communication_notification_center/hooks/ManagerCommunicationNotificationCenterDemoRepository';

export function ManagerCommunicationNotificationCenterNotificationHistorySection() {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY.filter((h) => {
      const matchChannel = channelFilter === 'all' || h.channel.toLowerCase() === channelFilter.toLowerCase();
      const matchStatus = statusFilter === 'all' || h.status.toLowerCase() === statusFilter.toLowerCase();
      const matchType = typeFilter === 'all' || h.type.toLowerCase() === typeFilter.toLowerCase();
      const matchQ =
        !q ||
        h.recipient.toLowerCase().includes(q) ||
        h.type.toLowerCase().includes(q) ||
        h.channel.toLowerCase().includes(q) ||
        h.status.toLowerCase().includes(q);
      return matchChannel && matchStatus && matchType && matchQ;
    });
  }, [searchQuery, channelFilter, statusFilter, typeFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || channelFilter !== 'all' || statusFilter !== 'all' || typeFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setChannelFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const handleExportCsv = () => {
    const headers = 'Recipient,Type,Channel,Date,Status\n';
    const rows = filteredHistory
      .map((h) => `"${h.recipient}","${h.type}","${h.channel}","${h.date}","${h.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `notification_history_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Notification history exported to CSV successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  const columnDefs: NativeColumn[] = useMemo(() => {
    const typeLabels: Record<string, string> = {
      'Due reminder': tManagerUi('due_reminder'),
      'Overdue reminder': tManagerUi('overdue_reminder'),
      'Reservation ready': tManagerUi('reservation_ready'),
      'Membership expiry reminder': tManagerUi('membership_expiry_reminder'),
      'Manual member notification': tManagerUi('manual_member_notification'),
      Announcement: tManagerUi('tab_announcements'),
    };

    return [
      {
        field: 'recipient',
        headerName: tManagerUi('recipient'),
        flex: 2,
        minWidth: 160,
        cellRenderer: (p: NativeCellParams) => {
          const name = String(p.value ?? '—');
          const initial = name.charAt(0).toUpperCase();
          return (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
                {initial}
              </div>
              <span className="text-xs sm:text-sm font-bold text-primary truncate">
                {name}
              </span>
            </div>
          );
        },
      },
      {
        field: 'type',
        headerName: tManagerUi('message_type'),
        flex: 1.8,
        minWidth: 150,
        cellRenderer: (p: NativeCellParams) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-highlight border border-border text-secondary">
            {typeLabels[String(p.value)] ?? p.value}
          </span>
        ),
      },
      {
        field: 'channel',
        headerName: tManagerUi('channel'),
        width: 120,
        cellRenderer: (p: NativeCellParams) => {
          if (p.value === 'Email') {
            return (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Mail size={12} aria-hidden="true" />
                <span>{tManagerUi('email')}</span>
              </span>
            );
          }
          if (p.value === 'SMS') {
            return (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <MessageSquare size={12} aria-hidden="true" />
                <span>{tManagerUi('sms')}</span>
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Smartphone size={12} aria-hidden="true" />
              <span>{tManagerUi('whatsapp')}</span>
            </span>
          );
        },
      },
      {
        field: 'date',
        headerName: tManagerUi('date'),
        width: 150,
        cellRenderer: (p: NativeCellParams) => (
          <div className="flex items-center gap-1.5 text-xs text-secondary font-mono">
            <Clock size={12} className="opacity-70 shrink-0" />
            <span>{String(p.value ?? '—')}</span>
          </div>
        ),
      },
      {
        field: 'status',
        headerName: tManagerUi('status'),
        width: 120,
        cellRenderer: (p: NativeCellParams) =>
          p.value === 'Delivered' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <CheckCheck size={12} />
              <span>Delivered</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/25">
              <AlertCircle size={12} />
              <span>Failed</span>
            </span>
          ),
      },
    ];
  }, [tManagerUi]);

  return (
    <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col space-y-4">
      {/* Header and Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-primary">
            {tManagerUi('notification_history')}
          </h2>
          <p className="text-xs text-secondary mt-0.5">
            {tManagerUi('log_of_all_manual_and_automated_alerts_sent')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          <button
            type="button"
            onClick={handlePrint}
            className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-3.5 rounded-xl border border-border bg-card hover:bg-surface-hover transition-colors cursor-pointer"
            title="Print notification history"
          >
            <Printer size={13} className="text-secondary" />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-3.5 rounded-xl border border-border bg-card hover:bg-surface-hover transition-colors cursor-pointer"
            title="Export Notification History CSV"
          >
            <Download size={13} className="text-secondary" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Multi-Filter Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-surface/40 border border-border flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3">
        {/* Search Box with Guaranteed Non-Overlapping Padding */}
        <div className="relative flex-1 min-w-[200px] flex items-center">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none z-10"
          />
          <input
            type="search"
            placeholder="Search recipient, type, or channel..."
            className="mgr-input mgr-input-with-icon h-10 !pl-10 text-xs sm:text-sm w-full rounded-xl bg-surface/60 border border-border focus:border-primary"
            style={{ paddingLeft: '2.6rem', paddingRight: searchQuery ? '2.25rem' : '1rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-secondary hover:text-primary rounded-md z-10 cursor-pointer"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
          <select
            aria-label="Filter by Channel"
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="mgr-select h-10 text-xs sm:text-sm py-1.5 px-3 min-w-[120px] rounded-xl bg-surface/60 border border-border focus:border-primary cursor-pointer"
          >
            <option value="all">All Channels</option>
            <option value="WhatsApp">📱 WhatsApp</option>
            <option value="SMS">💬 SMS</option>
            <option value="Email">✉️ Email</option>
          </select>

          <select
            aria-label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mgr-select h-10 text-xs sm:text-sm py-1.5 px-3 min-w-[110px] rounded-xl bg-surface/60 border border-border focus:border-primary cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Delivered">🟢 Delivered</option>
            <option value="Failed">🔴 Failed</option>
          </select>

          <select
            aria-label="Filter by Message Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="mgr-select h-10 text-xs sm:text-sm py-1.5 px-3 min-w-[130px] rounded-xl bg-surface/60 border border-border focus:border-primary cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="Due reminder">Due reminder</option>
            <option value="Overdue reminder">Overdue reminder</option>
            <option value="Membership expiry reminder">Expiry reminder</option>
            <option value="Reservation ready">Reservation ready</option>
            <option value="Manual member notification">Manual notification</option>
            <option value="Announcement">Announcement</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center justify-center gap-1 h-10 px-3.5 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer transition-colors"
            title="Reset filters"
          >
            <X size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="flex-1 w-full min-h-[22rem] overflow-x-auto rounded-xl border border-border bg-card/40">
        <ManagerCommunicationNotificationCenterNativeTable
          getRowKey={(row) => row.id}
          rows={filteredHistory}
          columns={columnDefs}
          labels={{
            previous: tManagerUi('previous_page'),
            next: tManagerUi('next_page'),
          }}
        />
      </div>
    </div>
  );
}
