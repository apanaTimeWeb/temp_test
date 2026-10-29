import { http, HttpResponse } from 'msw';
import {
  getManagerEnquiriesMockEnquiries,
  getManagerEnquiriesMockEnquiry,
} from '@/app/frontend_manager/manager_members/members_enquiries/mocks/manager_members_enquiries_fixtures/ManagerMembersEnquiriesFixtures';

/** Read-only MSW handlers mirror the current list/detail read contracts. No mock mutation endpoints are invented. */
const TEST_REQUEST_ID = 'msw-manager-members-enquiries';
export const managerCrmHandlers = [
  http.get('/crm/enquiries', () => HttpResponse.json({
    success: true,
    message: 'Enquiries loaded.',
    data: getManagerEnquiriesMockEnquiries(),
    requestId: TEST_REQUEST_ID,
  })),
  http.get('/crm/enquiries/:id', ({ params }) => {
    const enquiry = getManagerEnquiriesMockEnquiry(String(params.id));
    if (!enquiry) {
      return HttpResponse.json({
        success: false,
        message: 'Enquiry not found',
        data: null,
        error: 'Enquiry not found',
        errorCode: 'ENQUIRY_NOT_FOUND',
        statusCode: 404,
        requestId: TEST_REQUEST_ID,
      }, { status: 404 });
    }
    return HttpResponse.json({
      success: true,
      message: 'Enquiry loaded.',
      data: enquiry,
      requestId: TEST_REQUEST_ID,
    });
  }),
];
