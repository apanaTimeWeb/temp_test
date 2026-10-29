'use client';
// RESPONSIBILITY: Render the communication notification center notification history section section of the components feature. It does not own backend persistence or cross-feature business logic.
import ManagerCommunicationNotificationCenterNativeTable, { type NativeColumn, type NativeCellParams } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_table_parts/ManagerCommunicationNotificationCenterNativeTable';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, MessageSquare, Smartphone } from 'lucide-react';
import { MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY } from '@/app/frontend_manager/manager_communication/communication_notification_center/hooks/ManagerCommunicationNotificationCenterDemoRepository';


export function ManagerCommunicationNotificationCenterNotificationHistorySection() {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');
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
      <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
        <h2 className="text-xl font-bold text-primary">{tManagerUi('notification_history')}</h2>
        <p className="text-sm text-secondary">{tManagerUi('log_of_all_manual_and_automated_alerts_sent')}</p>
      </div>
      <div className="flex-1 w-full h-96">
        <ManagerCommunicationNotificationCenterNativeTable getRowKey={(row) => row.id} rows={MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY} columns={columnDefs} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }} />
      </div>
    </div>
  );
}
