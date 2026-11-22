/**
 * Module-owned illustrative fixtures. These records are preview-only and are not live business data.
 */

export type TemplateDispatchChannel = 'auto_api_single' | 'manual_free_web';

export interface Template {
  id: string;
  label: string;
  icon: string;
  body: string;
  dispatchChannel?: TemplateDispatchChannel;
}

export const MANAGER_COMMUNICATION_SAMPLE_WHATSAPP_TEMPLATES: Template[] = [
  { id: 'welcome',      label: 'Welcome Message',      icon: '👋', dispatchChannel: 'auto_api_single',  body: 'Welcome to {libraryname}, {name}! Your seat {seat} is confirmed. We wish you a productive study journey. — Library OS Team' },
  { id: 'fee_reminder', label: 'Fee Reminder',          icon: '💰', dispatchChannel: 'manual_free_web', body: 'Hi {name}, your fee of {amount} is due on {duedate}. Please pay on time to avoid late charges. — {libraryname}' },
  { id: 'renewal',      label: 'Renewal Alert',         icon: '🔁', dispatchChannel: 'manual_free_web', body: 'Hi {name}, your {planname} subscription expires in 3 days. Renew now to continue uninterrupted access. — {libraryname}' },
  { id: 'receipt',      label: 'Payment Receipt',       icon: '🧾', dispatchChannel: 'auto_api_single',  body: 'Dear {name}, your payment of {amount} has been received. Thank you! Contact us at {phone} for queries. — {libraryname}' },
  { id: 'notice',       label: 'Notice Broadcast',      icon: '📢', dispatchChannel: 'manual_free_web', body: 'Important Notice from {libraryname}: Dear {name}, please note the following update from the library management.' },
  { id: 'absentee',     label: 'Absentee Parent Alert', icon: '📅', dispatchChannel: 'manual_free_web', body: 'Dear Parent, your ward {name} (Seat: {seat}) has been absent for multiple consecutive days. Please contact {libraryname} at {phone}.' },
  { id: 'ptp',          label: 'PTP Payment Reminder',  icon: '🤝', dispatchChannel: 'manual_free_web', body: 'Hi {name}, this is a reminder that you had committed to pay {amount} by {duedate}. Please complete your payment. — {libraryname}' },
];
