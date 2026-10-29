/**
 * Module-owned illustrative fixtures. These records are preview-only and are not live business data.
 */


export interface ManagerCommunicationNotificationCenterNotificationHistoryRow {
  id: string; recipient: string; type: string; date: string; status: 'Delivered' | 'Failed'; channel: 'SMS' | 'Email' | 'WhatsApp';
}

export const MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY: ManagerCommunicationNotificationCenterNotificationHistoryRow[] = [
    { id: '1', recipient: 'Rahul Sharma (LIB-001)', type: 'Overdue reminder', date: '2026-10-01 14:30', status: 'Delivered', channel: 'SMS' },
    { id: '2', recipient: 'Priya Verma (LIB-022)', type: 'Reservation ready', date: '2026-10-01 10:15', status: 'Delivered', channel: 'Email' },
    { id: '3', recipient: 'Amit Kumar (LIB-045)', type: 'Membership expiry reminder', date: '2026-09-30 09:00', status: 'Failed', channel: 'WhatsApp' },
    { id: '4', recipient: 'All Active Members', type: 'Announcement', date: '2026-09-28 11:00', status: 'Delivered', channel: 'Email' },
  ];
