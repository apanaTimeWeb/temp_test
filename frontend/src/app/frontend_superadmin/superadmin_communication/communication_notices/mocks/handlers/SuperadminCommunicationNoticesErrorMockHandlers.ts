// RESPONSIBILITY: Define isolated mock handlers for communication notices; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_communication/communication_notices/mocks/handlers/SuperadminCommunicationNoticesErrorMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
import { http, HttpResponse } from 'msw';
import { SUPERADMIN_COMMUNICATION_NOTICES_API as __SUPERADMIN_COMMUNICATION_NOTICES_API } from "@/app/frontend_superadmin/superadmin_communication/communication_notices/config/superadmin_communication_notices.url_config";

/** Error-state scenario for the verified NOTICES_LIST read contract; no endpoint is added. */
export const SUPERADMIN_COMMUNICATION_NOTICES_ERROR_MSW_HANDLERS = [
  http.get(__SUPERADMIN_COMMUNICATION_NOTICES_API.NOTICES_LIST, () => HttpResponse.json({ success: false, message: 'Service temporarily unavailable', data: null, error: 'SERVICE_UNAVAILABLE', errorCode: 'COMMUNICATION.NOTICES.UNAVAILABLE', statusCode: 503, requestId: 'msw-service-unavailable' }, { status: 503 })),
];
