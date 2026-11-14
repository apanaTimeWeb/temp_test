// RESPONSIBILITY: Define source-level test coverage for support tickets using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_support/support_tickets/tests/SuperadminSupportTicketsOverviewHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SUPPORT_TICKETS_ROUTES as __SUPERADMIN_SUPPORT_TICKETS_ROUTES } from "@/app/frontend_superadmin/superadmin_support/support_tickets/config/superadmin_support_tickets.url_config";
import { SUPERADMIN_SUPPORT_TICKETS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_support/support_tickets/api/superadmin_support_tickets.query_keys';

describe('support_tickets standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_SUPPORT_TICKETS_ROUTES.SUPERADMIN_SUPPORT_TICKETS_OVERVIEW_URLS.PAGE).toContain('/superadmin/superadmin_support');
    expect(__SUPERADMIN_SUPPORT_TICKETS_ROUTES.SUPERADMIN_SUPPORT_TICKETS_OVERVIEW_URLS.SCREEN).toBe("/superadmin/superadmin_support/support_tickets");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_SUPPORT_TICKETS_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_support', 'support_tickets']);
  });
});
