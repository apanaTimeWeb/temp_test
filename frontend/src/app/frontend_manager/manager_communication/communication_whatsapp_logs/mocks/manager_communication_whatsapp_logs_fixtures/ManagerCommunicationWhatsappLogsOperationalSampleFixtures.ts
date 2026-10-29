/**
 * Module-owned illustrative fixtures. These records are preview-only and are not live business data.
 */

export interface WaLog {
  id: string; dateTime: string; phone: string; student: string;
  type: 'welcome' | 'fee_reminder' | 'receipt' | 'notice' | 'renewal';
  status: 'Pending' | 'Sent' | 'Delivered' | 'Failed';
  error: string; message: string;
}

export const MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_LOGS: WaLog[] = [
  { id: '1', dateTime: '2026-04-12 10:45 AM', phone: '98****2310', student: 'Rahul Sharma',  type: 'receipt',      status: 'Delivered', error: '',                       message: 'Dear Rahul, your payment of INR 1,000 has been received. Receipt #R-2026-001. Thank you! — Library OS' },
  { id: '2', dateTime: '2026-04-12 09:30 AM', phone: '97****8810', student: 'Priya Verma',   type: 'renewal',      status: 'Delivered', error: '',                       message: 'Hi Priya, your subscription expires in 3 days on 15-Apr-2026. Please renew to continue access. — Library OS' },
  { id: '3', dateTime: '2026-04-11 06:01 PM', phone: '89****1230', student: 'Amit Kumar',    type: 'welcome',      status: 'Delivered', error: '',                       message: 'Welcome to Library OS, Amit! Your seat S-03 (Morning shift) is confirmed. Smart ID: #003. — Library OS' },
  { id: '4', dateTime: '2026-04-11 02:00 PM', phone: '73****5670', student: 'Sneha Patel',   type: 'fee_reminder', status: 'Failed',    error: 'Number not on WhatsApp', message: 'Hi Sneha, your fee of INR 1,000 is due on 15-Apr-2026. Please pay on time to avoid late charges. — Library OS' },
  { id: '5', dateTime: '2026-04-10 11:00 AM', phone: '91****4430', student: 'Rohan Das',     type: 'notice',       status: 'Delivered', error: '',                       message: 'Notice: Library will be closed on 14-Apr-2026 (Dr. Ambedkar Jayanti). Normal operations resume 15-Apr. — Library OS' },
  { id: '6', dateTime: '2026-04-10 09:15 AM', phone: '98****0010', student: 'Kavita Singh',  type: 'receipt',      status: 'Sent',      error: '',                       message: 'Dear Kavita, your payment of INR 800 has been received. Receipt #R-2026-002. Thank you! — Library OS' },
  { id: '7', dateTime: '2026-04-09 03:00 PM', phone: '96****7720', student: 'Deepak Mishra', type: 'fee_reminder', status: 'Pending',   error: '',                       message: 'Hi Deepak, your fee of INR 1,200 is due on 10-Apr-2026. Please pay on time. — Library OS' },
];

export interface Template { id: string; label: string; icon: string; body: string; }

export const MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES: Template[] = [
  { id: 'welcome',      label: 'Welcome Message',      icon: '👋', body: 'Welcome to {libraryname}, {name}! Your seat {seat} is confirmed. We wish you a productive study journey. — Library OS Team' },
  { id: 'fee_reminder', label: 'Fee Reminder',          icon: '💰', body: 'Hi {name}, your fee of {amount} is due on {duedate}. Please pay on time to avoid late charges. — {libraryname}' },
  { id: 'renewal',      label: 'Renewal Alert',         icon: '🔁', body: 'Hi {name}, your {planname} subscription expires in 3 days. Renew now to continue uninterrupted access. — {libraryname}' },
  { id: 'receipt',      label: 'Payment Receipt',       icon: '🧾', body: 'Dear {name}, your payment of {amount} has been received. Thank you! Contact us at {phone} for queries. — {libraryname}' },
  { id: 'notice',       label: 'Notice Broadcast',      icon: '📢', body: 'Important Notice from {libraryname}: Dear {name}, please note the following update from the library management.' },
  { id: 'absentee',     label: 'Absentee Parent Alert', icon: '📅', body: 'Dear Parent, your ward {name} (Seat: {seat}) has been absent for multiple consecutive days. Please contact {libraryname} at {phone}.' },
  { id: 'ptp',          label: 'PTP Payment Reminder',  icon: '🤝', body: 'Hi {name}, this is a reminder that you had committed to pay {amount} by {duedate}. Please complete your payment. — {libraryname}' },
];


export interface ManagerCommunicationWhatsappLogsNotificationHistoryRow {
  id: string; recipient: string; type: string; date: string; status: 'Delivered' | 'Failed'; channel: 'SMS' | 'Email' | 'WhatsApp';
}

export const MANAGER_COMMUNICATION_SAMPLE_NOTIFICATION_HISTORY: ManagerCommunicationWhatsappLogsNotificationHistoryRow[] = [
    { id: '1', recipient: 'Rahul Sharma (LIB-001)', type: 'Overdue reminder', date: '2026-10-01 14:30', status: 'Delivered', channel: 'SMS' },
    { id: '2', recipient: 'Priya Verma (LIB-022)', type: 'Reservation ready', date: '2026-10-01 10:15', status: 'Delivered', channel: 'Email' },
    { id: '3', recipient: 'Amit Kumar (LIB-045)', type: 'Membership expiry reminder', date: '2026-09-30 09:00', status: 'Failed', channel: 'WhatsApp' },
    { id: '4', recipient: 'All Active Members', type: 'Announcement', date: '2026-09-28 11:00', status: 'Delivered', channel: 'Email' },
  ];
