'use client';
// RESPONSIBILITY: Render the communication notification center notification history section section of the components feature. It does not own backend persistence or cross-feature business logic.
import ManagerCommunicationNotificationCenterNativeTable, { type NativeColumn, type NativeCellParams } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_table_parts/ManagerCommunicationNotificationCenterNativeTable';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, MessageSquare, Smartphone, Search, X, Download } from 'lucide-react';
import { toast } from 'sonner';
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

  const hasActiveFilters = searchQuery.trim() !== '' || channelFilter !== 'all' || statusFilter !== 'all' || typeFilter !== 'all';

  const handleExportCsv = () => {
    const headers = 'Recipient,Type,Channel,Date,Status\n';
    const rows = filteredHistory.map((h) =>
      `"${h.recipient}","${h.type}","${h.channel}","${h.date}","${h.status}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `notification_history_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Notification history exported to CSV successfully');
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
    const statusLabels: Record<string, string> = { Delivered: tManagerUi('delivered'), Failed: tManagerUi('failed') };
    return [
      { field: 'recipient', headerName: tManagerUi('recipient'), flex: 2, cellClass: 'text-primary font-medium' },
      { field: 'type', headerName: tManagerUi('message_type'), flex: 2, cellClass: 'text-secondary', cellRenderer: (p: NativeCellParams) => typeLabels[String(p.value)] ?? p.value },
      { field: 'channel', headerName: tManagerUi('channel'), flex: 1, cellRenderer: (p: NativeCellParams) => {
        if (p.value === 'Email') return <span className="flex items-center gap-1 text-info"><Mail size={14} aria-hidden="true"/> {tManagerUi('email')}</span>;
        if (p.value === 'SMS') return <span className="flex items-center gap-1 text-success"><MessageSquare size={14} aria-hidden="true"/> {tManagerUi('sms')}</span>;
        return <span className="flex items-center gap-1 text-success"><Smartphone size={14} aria-hidden="true"/> {tManagerUi('whatsapp')}</span>;
      }},
      { field: 'date', headerName: tManagerUi('date'), flex: 1.5, cellClass: 'text-secondary' },
      { field: 'status', headerName: tManagerUi('status'), flex: 1, cellRenderer: (p: NativeCellParams) => (
        <span className={`mgr-badge ${p.value === 'Delivered' ? 'mgr-badge--success' : 'mgr-badge--danger'}`}>{statusLabels[String(p.value)] ?? p.value}</span>
      )},
    ];
  }, [tManagerUi]);

  return (
    <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-primary">{tManagerUi('notification_history')}</h2>
          <p className="text-xs text-secondary mt-0.5">{tManagerUi('log_of_all_manual_and_automated_alerts_sent')}</p>
        </div>
        
        {/* Multi-Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="search"
              placeholder="Search recipient, type, or channel..."
              className="mgr-input pl-8 text-xs w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            aria-label="Filter by Channel"
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="mgr-select text-xs py-1.5 px-3 min-w-[120px]"
          >
            <option value="all">All Channels</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="SMS">SMS</option>
            <option value="Email">Email</option>
          </select>

          <select
            aria-label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mgr-select text-xs py-1.5 px-3 min-w-[110px]"
          >
            <option value="all">All Status</option>
            <option value="Delivered">Delivered</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            aria-label="Filter by Message Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="mgr-select text-xs py-1.5 px-3 min-w-[140px]"
          >
            <option value="all">All Types</option>
            <option value="Due reminder">Due reminder</option>
            <option value="Overdue reminder">Overdue reminder</option>
            <option value="Membership expiry reminder">Expiry reminder</option>
            <option value="Reservation ready">Reservation ready</option>
            <option value="Manual member notification">Manual notification</option>
            <option value="Announcement">Announcement</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setChannelFilter('all');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
              title="Reset filters"
            >
              <X size={13} /> Reset
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCsv}
            className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
            title="Export Notification History CSV"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>
      <div className="flex-1 w-full h-96">
        <ManagerCommunicationNotificationCenterNativeTable
          getRowKey={(row) => row.id}
          rows={filteredHistory}
          columns={columnDefs}
          labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }}
        />
      </div>
    </div>
  );
}
