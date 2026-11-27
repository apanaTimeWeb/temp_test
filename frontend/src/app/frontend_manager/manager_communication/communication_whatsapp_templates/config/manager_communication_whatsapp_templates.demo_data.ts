/**
 * Preview-only sample templates and persona fixtures for WhatsApp template authoring.
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
  { id: 'welcome', label: 'Welcome Message', icon: '👋', dispatchChannel: 'auto_api_single', body: 'Welcome to {libraryname}, {name}! Your seat {seat} is confirmed. We wish you a productive study journey. — Library OS Team' },
  { id: 'fee_reminder', label: 'Fee Reminder', icon: '💰', dispatchChannel: 'manual_free_web', body: 'Hi {name}, your fee of {amount} is due on {duedate}. Please pay on time to avoid late charges. — {libraryname}' },
  { id: 'renewal', label: 'Renewal Alert', icon: '🔁', dispatchChannel: 'manual_free_web', body: 'Hi {name}, your {planname} subscription expires in 3 days. Renew now to continue uninterrupted access. — {libraryname}' },
  { id: 'receipt', label: 'Payment Receipt', icon: '🧾', dispatchChannel: 'auto_api_single', body: 'Dear {name}, your payment of {amount} has been received. Thank you! Contact us at {phone} for queries. — {libraryname}' },
  { id: 'notice', label: 'Notice Broadcast', icon: '📢', dispatchChannel: 'manual_free_web', body: 'Important Notice from {libraryname}: Dear {name}, please note the following update from the library management.' },
  { id: 'absentee', label: 'Absentee Parent Alert', icon: '📅', dispatchChannel: 'manual_free_web', body: 'Dear Parent, your ward {name} (Seat: {seat}) has been absent for multiple consecutive days. Please contact {libraryname} at {phone}.' },
  { id: 'ptp', label: 'PTP Payment Reminder', icon: '🤝', dispatchChannel: 'manual_free_web', body: 'Hi {name}, this is a reminder that you had committed to pay {amount} by {duedate}. Please complete your payment. — {libraryname}' },
];

export interface StudentSampleProfile {
  id: string;
  label: string;
  badge: string;
  name: string;
  amount: string;
  duedate: string;
  planname: string;
  libraryname: string;
  phone: string;
  seat: string;
}

const formatInrSample = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export const DEMO_PREVIEW_AMOUNT = formatInrSample(1000);
export const DEMO_CUSTOM_AMOUNT_PLACEHOLDER = `e.g. ${formatInrSample(1200)}`;

export const DEFAULT_SAMPLE_PROFILES: StudentSampleProfile[] = [
  {
    id: 'rahul',
    label: 'Rahul Sharma',
    badge: 'General Member',
    name: 'Rahul Sharma',
    amount: formatInrSample(1000),
    duedate: '15-Apr-2026',
    planname: 'Monthly Morning Plan',
    libraryname: 'Central Study Hub - Branch 1',
    phone: '+91 98765 43210',
    seat: 'Seat S-03 (Hall A)',
  },
  {
    id: 'priya',
    label: 'Priya Patel',
    badge: 'Due Fees / 24x7',
    name: 'Priya Patel',
    amount: formatInrSample(1500),
    duedate: '10-May-2026',
    planname: 'Full Day 24x7 Reserve',
    libraryname: 'Central Study Hub - Branch 2',
    phone: '+91 98112 34567',
    seat: 'Cabin C-09 (Quiet Zone)',
  },
  {
    id: 'vikram',
    label: 'Vikramaditya C. Rao',
    badge: 'Quarterly VIP',
    name: 'Vikramaditya C. Rao',
    amount: formatInrSample(2400),
    duedate: '01-Jun-2026',
    planname: 'Quarterly Premium Plan',
    libraryname: 'Central Study Hub - Branch 1',
    phone: '+91 97654 32109',
    seat: 'Seat D-22 (AC Hall B)',
  },
];

export const createDefaultCustomProfile = (): StudentSampleProfile => ({
  id: 'custom',
  label: 'Custom Student',
  badge: 'Custom Persona',
  name: 'Rohit Verma',
  amount: formatInrSample(1200),
  duedate: '25-Apr-2026',
  planname: 'Morning Shift (6 AM - 2 PM)',
  libraryname: 'Central Study Hub - Branch 1',
  phone: '+91 99887 76655',
  seat: 'Seat S-14 (Hall A)',
});
