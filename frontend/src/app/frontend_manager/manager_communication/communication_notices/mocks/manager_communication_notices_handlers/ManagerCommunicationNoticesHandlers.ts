import { http, HttpResponse } from 'msw';
import { MANAGER_COMMUNICATION_NOTICES_URL } from '@/app/frontend_manager/manager_communication/communication_notices/config/manager_communication_notices.url_config';
import { managerNoticesNoticeResponseListSchema } from '@/app/frontend_manager/manager_communication/communication_notices/schemas/ManagerCommunicationNoticesSchema';
import { MANAGER_NOTICES_API_FIXTURES, MANAGER_NOTICES_EMPTY_FIXTURE } from '@/app/frontend_manager/manager_communication/communication_notices/mocks/manager_communication_notices_fixtures/ManagerCommunicationNoticesApiFixtures';

const TEST_REQUEST_ID = 'msw-manager-communication-notices';

export function managerNoticesTestResponse<T>(request: Request, populated: T, empty: T) {
  const mode = new URL(request.url).searchParams.get('__testMode');
  if (mode === 'error') {
    return HttpResponse.json({
      success: false,
      message: 'Synthetic test API error',
      data: null,
      error: 'Synthetic test API error',
      errorCode: 'SYNTHETIC_TEST_ERROR',
      statusCode: 503,
      requestId: TEST_REQUEST_ID,
    }, { status: 503 });
  }

  return HttpResponse.json({
    success: true,
    message: 'Notices loaded.',
    data: mode === 'empty' ? empty : populated,
    requestId: TEST_REQUEST_ID,
  });
}

const populated = managerNoticesNoticeResponseListSchema.parse(MANAGER_NOTICES_API_FIXTURES);
const empty = managerNoticesNoticeResponseListSchema.parse(MANAGER_NOTICES_EMPTY_FIXTURE);

export const managerNoticesHandlers = [
  http.get(MANAGER_COMMUNICATION_NOTICES_URL, ({ request }) => managerNoticesTestResponse(request, populated, empty)),
];
