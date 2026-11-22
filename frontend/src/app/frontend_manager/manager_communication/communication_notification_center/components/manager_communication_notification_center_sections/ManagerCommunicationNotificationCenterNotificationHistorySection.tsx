'use client';

import {
AlertCircle,
CheckCheck,
Clock,
Copy,
Download,
Eye,
Filter,
Mail,
MessageSquare,
Printer,
RotateCcw,
Search,
Send,
Smartphone,
X
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo,useState } from 'react';
import { toast } from 'sonner';

import ManagerCommunicationNotificationCenterNativeTable,{
type NativeCellParams,
type NativeColumn,
} from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_table_parts/ManagerCommunicationNotificationCenterNativeTable';
import { MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY } from '@/app/frontend_manager/manager_communication/communication_notification_center/hooks/ManagerCommunicationNotificationCenterDemoRepository';
import type { ManagerCommunicationNotificationCenterNotificationHistoryRow } from '@/app/frontend_manager/manager_communication/communication_notification_center/mocks/manager_communication_notification_center_fixtures/ManagerCommunicationNotificationCenterOperationalSampleFixtures';

export function ManagerCommunicationNotificationCenterNotificationHistorySection() {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [inspectingRow, setInspectingRow] =
    useState<ManagerCommunicationNotificationCenterNotificationHistoryRow | null>(null);

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
    toast.info('Filters reset to default');
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

  const handleResend = (row: ManagerCommunicationNotificationCenterNotificationHistoryRow, e?: React.MouseEvent) => {
    e?.stopPropagation();
    toast.success(`Resending notification to ${row.recipient} via ${row.channel}... Dispatched!`);
  };

  const CHANNEL_BUTTONS = [
    {
      id: 'all',
      label: 'All Channels',
      activeBg: 'rgba(99, 102, 241, 0.22)',
      activeBorder: '#6366f1',
      activeText: '#e0e7ff',
      activeGlow: '0 0 14px rgba(99, 102, 241, 0.45)',
    },
    {
      id: 'WhatsApp',
      label: '📱 WhatsApp',
      activeBg: 'rgba(16, 185, 129, 0.25)',
      activeBorder: '#10b981',
      activeText: '#d1fae5',
      activeGlow: '0 0 16px rgba(16, 185, 129, 0.5)',
    },
    {
      id: 'SMS',
      label: '💬 SMS',
      activeBg: 'rgba(245, 158, 11, 0.25)',
      activeBorder: '#f59e0b',
      activeText: '#fef3c7',
      activeGlow: '0 0 16px rgba(245, 158, 11, 0.5)',
    },
    {
      id: 'Email',
      label: '✉️ Email',
      activeBg: 'rgba(14, 165, 233, 0.25)',
      activeBorder: '#0ea5e9',
      activeText: '#e0f2fe',
      activeGlow: '0 0 16px rgba(14, 165, 233, 0.5)',
    },
  ];

  const STATUS_BUTTONS = [
    {
      id: 'all',
      label: 'All Status',
      activeBg: 'rgba(99, 102, 241, 0.22)',
      activeBorder: '#6366f1',
      activeText: '#e0e7ff',
      activeGlow: '0 0 14px rgba(99, 102, 241, 0.45)',
    },
    {
      id: 'Delivered',
      label: '🟢 Delivered',
      activeBg: 'rgba(16, 185, 129, 0.25)',
      activeBorder: '#10b981',
      activeText: '#d1fae5',
      activeGlow: '0 0 16px rgba(16, 185, 129, 0.5)',
    },
    {
      id: 'Failed',
      label: '🔴 Failed',
      activeBg: 'rgba(244, 63, 94, 0.25)',
      activeBorder: '#f43f5e',
      activeText: '#ffe4e6',
      activeGlow: '0 0 16px rgba(244, 63, 94, 0.5)',
    },
  ];

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
                onClick={(e) => {
                  e.stopPropagation();
                  setInspectingRow(row);
                }}
                className="p-1.5 rounded-lg border border-border bg-card/60 text-secondary hover:text-primary hover:border-border-focus hover:bg-surface-hover transition-colors cursor-pointer"
                title="View notification details"
                aria-label="View details"
              >
                <Eye size={13} />
              </button>

              <button
                type="button"
                onClick={(e) => handleResend(row, e)}
                className="p-1.5 rounded-lg border border-border bg-card/60 text-secondary hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-colors cursor-pointer"
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

      {/* Multi-Filter Toolbar with Interactive Color-Filled Filter Buttons */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-surface/40 border border-border flex flex-col gap-3">
        {/* Top Row: Non-Overlapping Search Box & Quick Type Dropdown */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box with Guaranteed Non-Overlapping Padding */}
          <div className="relative flex-1 min-w-[200px] flex items-center">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none z-10"
            />
            <input maxLength={100}
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

          <div className="flex items-center gap-2">
            <select
              aria-label="Filter by Message Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="mgr-select h-10 text-xs sm:text-sm py-1.5 px-3 min-w-[150px] rounded-xl bg-surface/60 border border-border focus:border-primary cursor-pointer"
            >
              <option value="all">All Message Types</option>
              <option value="Due reminder">🪙 Due reminder</option>
              <option value="Overdue reminder">⚠️ Overdue reminder</option>
              <option value="Membership expiry reminder">🔄 Expiry reminder</option>
              <option value="Reservation ready">🪑 Reservation ready</option>
              <option value="Manual member notification">💬 Manual notification</option>
              <option value="Announcement">📢 Announcement</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 cursor-pointer transition-colors"
                title="Reset all filters"
              >
                <X size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Clickable Channel & Status Box Pills (Filled with Color When Clicked) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
          {/* Channel Selector Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-secondary flex items-center gap-1 mr-1">
              <Filter size={11} />
              <span>Channel:</span>
            </span>
            {CHANNEL_BUTTONS.map((ch) => {
              const isSelected = channelFilter === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setChannelFilter(ch.id)}
                  style={
                    isSelected
                      ? {
                          backgroundColor: ch.activeBg,
                          borderColor: ch.activeBorder,
                          color: ch.activeText,
                          boxShadow: ch.activeGlow,
                        }
                      : undefined
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'font-bold'
                      : 'bg-card/60 border-border text-secondary hover:text-primary hover:bg-card hover:border-border-focus'
                  }`}
                >
                  <span>{ch.label}</span>
                </button>
              );
            })}
          </div>

          {/* Status Selector Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-secondary mr-1">Status:</span>
            {STATUS_BUTTONS.map((st) => {
              const isSelected = statusFilter === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  style={
                    isSelected
                      ? {
                          backgroundColor: st.activeBg,
                          borderColor: st.activeBorder,
                          color: st.activeText,
                          boxShadow: st.activeGlow,
                        }
                      : undefined
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? 'font-bold'
                      : 'bg-card/60 border-border text-secondary hover:text-primary hover:bg-card hover:border-border-focus'
                  }`}
                >
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>
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

      {/* Interactive Modal: Inspect Notification Slip & Re-dispatch */}
      {inspectingRow && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Dispatch Log #{inspectingRow.id}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                      inspectingRow.status === 'Delivered'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {inspectingRow.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-primary">Notification Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingRow(null)}
                className="p-1.5 rounded-lg border border-border text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer transition-colors"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content Details */}
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-surface/50 border border-border">
                <div>
                  <span className="text-[11px] text-secondary font-semibold">Recipient</span>
                  <p className="font-bold text-primary mt-0.5">{inspectingRow.recipient}</p>
                </div>
                <div>
                  <span className="text-[11px] text-secondary font-semibold">Channel</span>
                  <p className="font-bold text-primary mt-0.5 flex items-center gap-1.5">
                    {inspectingRow.channel === 'WhatsApp' && (
                      <Smartphone size={13} className="text-emerald-400" />
                    )}
                    {inspectingRow.channel === 'SMS' && (
                      <MessageSquare size={13} className="text-amber-400" />
                    )}
                    {inspectingRow.channel === 'Email' && (
                      <Mail size={13} className="text-sky-400" />
                    )}
                    <span>{inspectingRow.channel}</span>
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-secondary font-semibold">Message Type</span>
                  <p className="font-medium text-secondary mt-0.5">{inspectingRow.type}</p>
                </div>
                <div>
                  <span className="text-[11px] text-secondary font-semibold">Timestamp</span>
                  <p className="font-mono text-secondary mt-0.5">{inspectingRow.date}</p>
                </div>
              </div>

              {/* Sample Message Body Box */}
              <div className="p-3.5 rounded-xl bg-surface/30 border border-border space-y-1.5">
                <span className="text-[11px] font-semibold text-secondary">Dispatched Message Body</span>
                <p className="text-xs sm:text-sm text-primary leading-relaxed bg-card p-3 rounded-lg border border-border/70 font-mono">
                  {`Hello ${inspectingRow.recipient.split(' ')[0]}, your library ${inspectingRow.type.toLowerCase()} notice has been recorded in the system. Ref #${inspectingRow.id} on ${inspectingRow.date}.`}
                </p>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Recipient: ${inspectingRow.recipient}\nType: ${inspectingRow.type}\nChannel: ${inspectingRow.channel}\nDate: ${inspectingRow.date}\nStatus: ${inspectingRow.status}`
                    );
                    toast.success('Notification summary copied to clipboard');
                  }}
                  className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  <Copy size={12} />
                  <span>Copy</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="mgr-btn-outline inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  <Printer size={12} />
                  <span>Print Slip</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleResend(inspectingRow)}
                  className="mgr-btn-primary inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-95 transition-all cursor-pointer shadow-xs"
                >
                  <Send size={12} />
                  <span>Resend Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
