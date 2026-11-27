'use client';

import { ManagerCommunicationNotificationCenterHistoryInspectModal } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_sections/ManagerCommunicationNotificationCenterHistoryInspectModal';
import { ManagerCommunicationNotificationCenterHistoryToolbar } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_sections/ManagerCommunicationNotificationCenterHistoryToolbar';
import ManagerCommunicationNotificationCenterNativeTable, {
  type NativeCellParams,
  type NativeColumn,
} from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_table_parts/ManagerCommunicationNotificationCenterNativeTable';
import {
  MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY,
  type ManagerCommunicationNotificationCenterNotificationHistoryRow,
} from '@/app/frontend_manager/manager_communication/communication_notification_center/hooks/ManagerCommunicationNotificationCenterDemoRepository';
import { AlertCircle, CheckCheck, Clock, Download, Eye, Mail, MessageSquare, Printer, RotateCcw, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

export function ManagerCommunicationNotificationCenterNotificationHistorySection() {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [inspectingRow, setInspectingRow] = useState<ManagerCommunicationNotificationCenterNotificationHistoryRow | null>(null);

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

  const hasActiveFilters = searchQuery.trim() !== '' || channelFilter !== 'all' || statusFilter !== 'all' || typeFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setChannelFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
    toast.info('Filters reset to default', { id: 'manager-notif-history-reset' });
  };

  const handleExportCsv = () => {
    const headers = 'Recipient,Type,Channel,Date,Status\n';
    const rows = filteredHistory.map((h) => `"${h.recipient}","${h.type}","${h.channel}","${h.date}","${h.status}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `notification_history_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Notification history exported to CSV successfully', { id: 'manager-notif-history-export' });
  };

  const handleResend = (row: ManagerCommunicationNotificationCenterNotificationHistoryRow, e?: React.MouseEvent) => {
    e?.stopPropagation();
    toast.success(`Resending notification to ${row.recipient} via ${row.channel}... Dispatched!`, {
      id: `manager-notif-resend-${row.id}`,
    });
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
          return (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary-subtle text-primary font-bold text-xs flex items-center justify-center border border-border shrink-0">
                {name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs sm:text-sm font-bold text-primary truncate">{name}</span>
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
        width: 125,
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
      {
        field: 'actions' as any,
        headerName: 'Actions',
        width: 130,
        cellRenderer: (p: NativeCellParams) => {
          const row = p.data as ManagerCommunicationNotificationCenterNotificationHistoryRow;
          return (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setInspectingRow(row); }}
                className="p-1.5 rounded-lg border border-border bg-card text-secondary hover:text-primary hover:border-border-focus hover:bg-surface-hover motion-safe:transition-colors cursor-pointer"
                title="View notification details"
                aria-label="View details"
              >
                <Eye size={13} />
              </button>
              <button
                type="button"
                onClick={(e) => handleResend(row, e)}
                className="p-1.5 rounded-lg border border-border bg-card text-secondary hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 motion-safe:transition-colors cursor-pointer"
                title="Resend this message"
                aria-label="Resend notification"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          );
        },
      },
    ];
  }, [tManagerUi]);

  return (
    <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-primary">{tManagerUi('notification_history')}</h2>
          <p className="text-xs text-secondary mt-0.5">{tManagerUi('log_of_all_manual_and_automated_alerts_sent')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          <button
            type="button"
            onClick={() => window.print()}
            className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-3.5 rounded-xl border border-border bg-card hover:bg-surface-hover motion-safe:transition-colors cursor-pointer"
            title="Print notification history"
          >
            <Printer size={13} className="text-secondary" />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold py-2 px-3.5 rounded-xl border border-border bg-card hover:bg-surface-hover motion-safe:transition-colors cursor-pointer"
            title="Export Notification History CSV"
          >
            <Download size={13} className="text-secondary" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <ManagerCommunicationNotificationCenterHistoryToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        channelFilter={channelFilter}
        setChannelFilter={setChannelFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      <div className="flex-1 w-full min-h-[22rem] overflow-x-auto rounded-xl border border-border bg-card">
        <ManagerCommunicationNotificationCenterNativeTable
          getRowKey={(row) => row.id}
          rows={filteredHistory}
          columns={columnDefs}
          labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }}
        />
      </div>

      {inspectingRow && (
        <ManagerCommunicationNotificationCenterHistoryInspectModal
          row={inspectingRow}
          onClose={() => setInspectingRow(null)}
          onResend={handleResend}
        />
      )}
    </div>
  );
}
