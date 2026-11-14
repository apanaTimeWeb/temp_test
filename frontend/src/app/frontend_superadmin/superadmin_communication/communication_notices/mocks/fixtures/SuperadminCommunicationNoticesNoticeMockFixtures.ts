// RESPONSIBILITY: Define local sample fixtures for communication notices; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_communication/communication_notices/mocks/fixtures/SuperadminCommunicationNoticesNoticeMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Synthetic-only notice fixture for local contract tests; never production notice data. */
export const SUPERADMIN_COMMUNICATION_NOTICE_FIXTURES = [
  { id: 'notice-test-1', title: 'Scheduled maintenance', message: 'Sample test notice', createdAt: '2026-01-10T09:00:00.000Z', validTill: '2099-12-31T23:59:59.000Z' },
] as const;
