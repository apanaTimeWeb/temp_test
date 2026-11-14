// FLOW: Feature preview/test -> superadmin_communication/communication_whatsapp_integration/mocks/fixtures/SuperadminCommunicationWhatsappIntegrationWhatsappMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Responsibility: Superadmin System Whatsapp Fixtures; supplies module-owned mock fixtures or handler behavior only. */
export interface SuperadminWhatsappMessageLog {
  id: string;
  to: string;
  type: string;
  status: 'delivered' | 'failed' | 'pending';
  sentAt: string;
  template: string;
}

export const SUPERADMIN_WHATSAPP_PROVIDERS = [
  { id: 'twilio', label: 'Twilio', logo: '🔵', requiresSecret: true },
  { id: 'wati', label: 'Wati', logo: '🟢', requiresSecret: false },
  { id: 'aisensy', label: 'AiSensy', logo: '🟣', requiresSecret: false },
  { id: 'custom', label: 'Custom', logo: '⚙️', requiresSecret: true },
] as const;

// Reserved, synthetic sample recipients; these records are not provider delivery logs.
export const SUPERADMIN_WHATSAPP_SAMPLE_LOGS: SuperadminWhatsappMessageLog[] = [
  { id: 'sample-wl-001', to: '+1-202-555-0101', type: 'Fee Receipt', status: 'delivered', sentAt: '2026-04-12 10:45 AM', template: 'sample_receipt_confirmation' },
  { id: 'sample-wl-002', to: '+1-202-555-0102', type: 'Renewal Reminder', status: 'delivered', sentAt: '2026-04-12 09:30 AM', template: 'sample_renewal_alert' },
  { id: 'sample-wl-003', to: '+1-202-555-0103', type: 'Welcome Message', status: 'delivered', sentAt: '2026-04-11 06:01 PM', template: 'sample_welcome_new_student' },
  { id: 'sample-wl-004', to: '+1-202-555-0104', type: 'Fee Reminder', status: 'failed', sentAt: '2026-04-11 02:00 PM', template: 'sample_fee_due_reminder' },
  { id: 'sample-wl-005', to: '+1-202-555-0105', type: 'Seat Vacancy', status: 'delivered', sentAt: '2026-04-10 11:00 AM', template: 'sample_waitlist_notify' },
  { id: 'sample-wl-006', to: '+1-202-555-0106', type: 'Fee Receipt', status: 'delivered', sentAt: '2026-04-10 09:15 AM', template: 'sample_receipt_confirmation' },
];
