// RESPONSIBILITY: Define stable module-owned constants for support tickets; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_support/support_tickets/constants/SuperadminSupportTicketsOverviewStaticConstants.ts -> typed constants -> component/hook/config behavior.


/** Static module-owned options/status mapping extracted from SuperadminSupportTicketsOverviewDetailPanel.tsx. */
export const SUPERADMIN_SUPPORT_TICKETS_DETAIL_PANEL_SELECTOR = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

