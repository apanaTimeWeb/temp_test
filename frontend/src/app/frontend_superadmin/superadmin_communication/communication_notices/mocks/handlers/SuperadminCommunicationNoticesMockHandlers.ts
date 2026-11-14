// RESPONSIBILITY: Define isolated mock handlers for communication notices; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_communication/communication_notices/mocks/handlers/SuperadminCommunicationNoticesMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
import { http, HttpResponse } from 'msw';
import { SUPERADMIN_COMMUNICATION_NOTICES_API as __SUPERADMIN_COMMUNICATION_NOTICES_API } from "@/app/frontend_superadmin/superadmin_communication/communication_notices/config/superadmin_communication_notices.url_config";
import { SUPERADMIN_COMMUNICATION_NOTICE_FIXTURES } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/mocks/fixtures/SuperadminCommunicationNoticesNoticeMockFixtures';

/** Read-only handler for the verified NOTICES_LIST contract. No write success is simulated. */
export const SUPERADMIN_COMMUNICATION_NOTICES_MSW_HANDLERS = [
  http.get(__SUPERADMIN_COMMUNICATION_NOTICES_API.NOTICES_LIST, () => HttpResponse.json({ success: true, message: 'Loaded sample notice records.', data: SUPERADMIN_COMMUNICATION_NOTICE_FIXTURES, meta: { total: SUPERADMIN_COMMUNICATION_NOTICE_FIXTURES.length, page: 1, limit: Math.max(SUPERADMIN_COMMUNICATION_NOTICE_FIXTURES.length, 1), totalPages: Math.ceil(SUPERADMIN_COMMUNICATION_NOTICE_FIXTURES.length / Math.max(SUPERADMIN_COMMUNICATION_NOTICE_FIXTURES.length, 1)), hasNextPage: false, hasPrevPage: false }, requestId: 'msw-superadmin-notices-list' })),
];
