import { http, HttpResponse } from 'msw';
import { MANAGER_COMMUNICATION_COMPLAINTS_URL } from '@/app/frontend_manager/manager_communication/communication_complaints/config/manager_communication_complaints.url_config';
import { managerComplaintsComplaintResponseListSchema } from '@/app/frontend_manager/manager_communication/communication_complaints/schemas/ManagerCommunicationComplaintsSchema';
import { MANAGER_COMPLAINTS_API_FIXTURES, MANAGER_COMPLAINTS_EMPTY_FIXTURE } from '@/app/frontend_manager/manager_communication/communication_complaints/mocks/manager_communication_complaints_fixtures/ManagerCommunicationComplaintsApiFixtures';

const TEST_REQUEST_ID = 'msw-manager-communication-complaints';

export function managerComplaintsTestResponse<T>(request: Request, populated: T, empty: T) {
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
    message: 'Complaints loaded.',
    data: mode === 'empty' ? empty : populated,
    requestId: TEST_REQUEST_ID,
  });
}

const populated = managerComplaintsComplaintResponseListSchema.parse(MANAGER_COMPLAINTS_API_FIXTURES);
const empty = managerComplaintsComplaintResponseListSchema.parse(MANAGER_COMPLAINTS_EMPTY_FIXTURE);

export const managerComplaintsHandlers = [
  http.get(`*${MANAGER_COMMUNICATION_COMPLAINTS_URL}`, ({ request }) => managerComplaintsTestResponse(request, populated, empty)),
];
