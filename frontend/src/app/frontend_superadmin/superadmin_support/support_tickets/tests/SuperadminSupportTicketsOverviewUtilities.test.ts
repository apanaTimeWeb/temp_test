// RESPONSIBILITY: Define source-level test coverage for support tickets using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_support/support_tickets/tests/SuperadminSupportTicketsOverviewUtilities.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SUPPORT_TICKETS_FIXTURES } from '@/app/frontend_superadmin/superadmin_support/support_tickets/mocks/fixtures/SuperadminSupportTicketsOverviewMockFixtures';
import { buildSuperadminSupportTicketsPreviewCsv, compareSuperadminSupportTicketAges, filterSuperadminSupportTickets, parseSuperadminSupportTicketAgeMinutes } from '@/app/frontend_superadmin/superadmin_support/support_tickets/utils/SuperadminSupportTicketsOverviewUtilities';

describe('superadmin support ticket preview utilities', () => {
  it('parses mixed-unit age labels and compares elapsed durations chronologically', () => {
    expect(parseSuperadminSupportTicketAgeMinutes('4 hours')).toBe(240);
    expect(parseSuperadminSupportTicketAgeMinutes('1 day')).toBe(1440);
    expect(parseSuperadminSupportTicketAgeMinutes('not an age')).toBeNull();
    expect(compareSuperadminSupportTicketAges('2 hours', '1 day')).toBeLessThan(0);
    expect(compareSuperadminSupportTicketAges('5 days', '3 days')).toBeGreaterThan(0);
  });

  it('filters ticket records by exact status while preserving all rows for All', () => {
    expect(filterSuperadminSupportTickets(SUPERADMIN_SUPPORT_TICKETS_FIXTURES, 'All')).toHaveLength(SUPERADMIN_SUPPORT_TICKETS_FIXTURES.length);
    expect(filterSuperadminSupportTickets(SUPERADMIN_SUPPORT_TICKETS_FIXTURES, 'Open').every((ticket) => ticket.status === 'Open')).toBe(true);
    expect(filterSuperadminSupportTickets([], 'Resolved')).toEqual([]);
  });

  it('classifies preview CSV, uses a UTF-8 BOM, and escapes quotes/commas', () => {
    const firstFixture = SUPERADMIN_SUPPORT_TICKETS_FIXTURES[0];
    expect(firstFixture).toBeDefined();
    if (!firstFixture) throw new Error('Expected a non-empty support-ticket fixture');
    const sample = { ...firstFixture, subject: 'Payment, "gateway" failure' };
    const csv = buildSuperadminSupportTicketsPreviewCsv([sample]);
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('SAMPLE PREVIEW — NOT LIVE SUPPORT TICKETS');
    expect(csv).toContain('"Payment, ""gateway"" failure"');
  });
});
