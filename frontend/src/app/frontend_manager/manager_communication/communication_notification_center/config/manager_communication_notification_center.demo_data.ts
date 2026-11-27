export interface ManagerCommunicationNotificationCenterDemoHistoryRow {
  id: string;
  recipient: string;
  type: string;
  date: string;
  status: 'Delivered' | 'Failed';
  channel: 'SMS' | 'Email' | 'WhatsApp';
}

/** Runtime sample notification history detached from test-only mocks. */
export const MANAGER_COMMUNICATION_DEMO_NOTIFICATION_HISTORY: ManagerCommunicationNotificationCenterDemoHistoryRow[] = [
  { id: '1', recipient: 'Rahul Sharma (LIB-001)', type: 'Overdue reminder', date: '2026-10-01 14:30', status: 'Delivered', channel: 'SMS' },
  { id: '2', recipient: 'Priya Verma (LIB-022)', type: 'Reservation ready', date: '2026-10-01 10:15', status: 'Delivered', channel: 'Email' },
  { id: '3', recipient: 'Amit Kumar (LIB-045)', type: 'Membership expiry reminder', date: '2026-09-30 09:00', status: 'Failed', channel: 'WhatsApp' },
  { id: '4', recipient: 'All Active Members', type: 'Announcement', date: '2026-09-28 11:00', status: 'Delivered', channel: 'Email' },
];

export interface ManagerCommunicationNotificationDemoMember {
  id: string;
  name: string;
  phone: string;
  seat?: string;
  status: string;
}

export const MANAGER_COMMUNICATION_NOTIFICATION_DEMO_MEMBERS: ManagerCommunicationNotificationDemoMember[] = [
  { id: 'LIB-001', name: 'Rahul Sharma', phone: '9876543210', seat: 'S-01', status: 'Active' },
  { id: 'LIB-002', name: 'Priya Verma', phone: '9876543211', seat: 'S-14', status: 'Expired' },
  { id: 'LIB-003', name: 'Amit Kumar', phone: '9876543212', seat: 'S-08', status: 'Suspended' },
  { id: 'LIB-004', name: 'Sneha Patel', phone: '9876543213', seat: 'S-22', status: 'Active' },
  { id: 'LIB-005', name: 'Vikas Mishra', phone: '9876543214', seat: 'S-05', status: 'Active' },
  { id: 'LIB-006', name: 'Ananya Gupta', phone: '9876543215', seat: 'S-11', status: 'Active' },
  { id: 'LIB-007', name: 'Rohan Mehra', phone: '9876543216', seat: 'S-19', status: 'Expired' },
  { id: 'LIB-008', name: 'Pooja Reddy', phone: '9876543217', seat: 'S-02', status: 'Active' },
];
