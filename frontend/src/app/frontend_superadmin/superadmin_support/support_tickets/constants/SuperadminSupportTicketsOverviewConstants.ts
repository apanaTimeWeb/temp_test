// RESPONSIBILITY: Define stable module-owned constants for support tickets; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_support/support_tickets/constants/SuperadminSupportTicketsOverviewConstants.ts -> typed constants -> component/hook/config behavior.
/** Feature-owned UI choices for the sample support-tickets preview. */
export const SUPERADMIN_SUPPORT_TICKETS_FILTERS = ['All', 'Open', 'In-Progress', 'Resolved'] as const;
export const SUPERADMIN_SUPPORT_TICKETS_ASSIGNEE_OPTIONS = ['Unassigned', 'Sample Agent A', 'Sample Agent B'] as const;
export const SUPERADMIN_SUPPORT_TICKETS_SAMPLE_AVERAGE_RESPONSE = '1h 15m';
