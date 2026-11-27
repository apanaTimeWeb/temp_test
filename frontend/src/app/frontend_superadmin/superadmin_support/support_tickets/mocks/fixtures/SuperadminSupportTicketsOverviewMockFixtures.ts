// FLOW: Feature preview/test -> superadmin_support/support_tickets/mocks/fixtures/SuperadminSupportTicketsOverviewMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Responsibility: Superadmin Support Tickets Fixtures; supplies module-owned mock fixtures or handler behavior only. */
import type { SuperadminSupportTicket } from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes';
import { SUPERADMIN_SUPPORT_TICKETS_FIXTURES_PART1 } from './SuperadminSupportTicketsOverviewMockFixturesPart1';
import { SUPERADMIN_SUPPORT_TICKETS_FIXTURES_PART2 } from './SuperadminSupportTicketsOverviewMockFixturesPart2';
import { SUPERADMIN_SUPPORT_TICKETS_FIXTURES_PART3 } from './SuperadminSupportTicketsOverviewMockFixturesPart3';

export const SUPERADMIN_SUPPORT_TICKETS_FIXTURES: SuperadminSupportTicket[] = [
  ...SUPERADMIN_SUPPORT_TICKETS_FIXTURES_PART1,
  ...SUPERADMIN_SUPPORT_TICKETS_FIXTURES_PART2,
  ...SUPERADMIN_SUPPORT_TICKETS_FIXTURES_PART3,
];
