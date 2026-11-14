// RESPONSIBILITY: Define isolated mock handlers for support complaints; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_support/support_complaints/mocks/handlers/SuperadminSupportComplaintsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
import { http, HttpResponse } from 'msw';
import { SUPERADMIN_SUPPORT_COMPLAINTS_API as __SUPERADMIN_SUPPORT_COMPLAINTS_API } from "@/app/frontend_superadmin/superadmin_support/support_complaints/config/superadmin_support_complaints.url_config";
import { SUPERADMIN_SUPPORT_COMPLAINT_PREVIEW_FIXTURES } from '@/app/frontend_superadmin/superadmin_support/support_complaints/mocks/fixtures/SuperadminSupportComplaintsComplaintMockFixtures';

/** Read-only handler for the verified COMPLAINTS_LIST contract. No write success is simulated. */
export const SUPERADMIN_SUPPORT_COMPLAINTS_MSW_HANDLERS = [
  http.get(__SUPERADMIN_SUPPORT_COMPLAINTS_API.COMPLAINTS_LIST, () => {
    const rows = SUPERADMIN_SUPPORT_COMPLAINT_PREVIEW_FIXTURES.map((item) => ({
      id: item.id, subject: item.title, description: item.description, createdAt: item.date, status: item.status,
      student: item.student, isAnonymous: item.isAnonymous, resolvedBy: item.resolvedBy, resolvedDate: item.resolvedDate, resolvedNote: item.resolvedNote,
    }));
    const limit = Math.max(rows.length, 1);
    return HttpResponse.json({ success: true, message: 'Loaded sample complaint records.', data: rows, meta: { total: rows.length, page: 1, limit, totalPages: Math.ceil(rows.length / limit), hasNextPage: false, hasPrevPage: false }, requestId: 'msw-support-complaints-list' });
  }),
];
