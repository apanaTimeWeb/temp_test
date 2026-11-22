// RESPONSIBILITY: Define stable module-owned constants for support tickets; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_support/support_tickets/constants/SuperadminSupportTicketsOverviewConstants.ts -> typed constants -> component/hook/config behavior.
/** Feature-owned UI choices for the sample support-tickets preview. */
export const SUPERADMIN_SUPPORT_TICKETS_FILTERS = ['All', 'Open', 'In-Progress', 'Escalated', 'Resolved', 'Closed', 'Reopened'] as const;

export const SUPERADMIN_SUPPORT_TICKETS_ASSIGNEE_OPTIONS = [
  'Unassigned',
  'Sample Agent A',
  'Sample Agent B',
  'Tier-2 Lead Specialist',
  'Security Operations Officer',
] as const;

export const SUPERADMIN_SUPPORT_TICKETS_SAMPLE_AVERAGE_RESPONSE = '1h 15m';

export const SUPERADMIN_SUPPORT_TICKET_TYPES = [
  'Technical issue',
  'Billing issue',
  'Branch creation request',
  'Plan upgrade request',
  'Account access issue',
  'Data correction request',
  'Feature request',
  'Bug report',
  'Security complaint',
] as const;

export const SUPERADMIN_SUPPORT_ESCALATION_TIERS = [
  'Tier-2 Technical Specialist',
  'Lead Cloud Architect',
  'Security Incident Response Team',
  'Billing Operations Lead',
] as const;

export const SUPERADMIN_SUPPORT_ACCESS_DURATIONS = [
  { label: '15 Minutes', minutes: 15 },
  { label: '30 Minutes', minutes: 30 },
  { label: '1 Hour', minutes: 60 },
  { label: '2 Hours', minutes: 120 },
  { label: '4 Hours (Emergency Max)', minutes: 240 },
] as const;
