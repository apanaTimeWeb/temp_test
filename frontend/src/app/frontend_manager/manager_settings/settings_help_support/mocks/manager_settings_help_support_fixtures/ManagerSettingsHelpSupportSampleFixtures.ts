/** Explicit preview-only data. This is not a user's live ticket history. */
export type ManagerSettingsHelpSupportSampleTicket = {
  id: string; subject: string; category: string; priority: 'High' | 'Medium' | 'Low'; status: 'Open' | 'Closed'; date: string;
};
export const MANAGER_HELP_SUPPORT_SAMPLE_TICKETS: readonly ManagerSettingsHelpSupportSampleTicket[] = [
  { id: 'TCK-001', subject: 'Payment Gateway Issue', category: 'Finance', priority: 'High', status: 'Open', date: '2026-10-01' },
  { id: 'TCK-002', subject: 'How to add bulk students?', category: 'General', priority: 'Low', status: 'Closed', date: '2026-09-28' },
];
