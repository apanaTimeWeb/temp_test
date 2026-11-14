// RESPONSIBILITY: Define isolated mock handlers for support complaints; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_support/support_complaints/mocks/handlers/SuperadminSupportComplaintsErrorMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
import { http, HttpResponse } from 'msw';
import { SUPERADMIN_SUPPORT_COMPLAINTS_API as __SUPERADMIN_SUPPORT_COMPLAINTS_API } from "@/app/frontend_superadmin/superadmin_support/support_complaints/config/superadmin_support_complaints.url_config";

/** Error-state scenario for the verified COMPLAINTS_LIST read contract; no endpoint is added. */
export const SUPERADMIN_SUPPORT_COMPLAINTS_ERROR_MSW_HANDLERS = [
  http.get(__SUPERADMIN_SUPPORT_COMPLAINTS_API.COMPLAINTS_LIST, () => HttpResponse.json({ success: false, message: 'Service temporarily unavailable', data: null, error: 'SERVICE_UNAVAILABLE', errorCode: 'SUPPORT.COMPLAINTS.UNAVAILABLE', statusCode: 503, requestId: 'msw-service-unavailable' }, { status: 503 })),
];
