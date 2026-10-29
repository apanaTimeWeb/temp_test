import { http, HttpResponse } from 'msw';
import { MANAGER_MEMBERS_NEW_ADMISSION_API } from '@/app/frontend_manager/manager_members/members_new_admission/config/manager_members_new_admission.url_config';
import { managerStudentsMockState } from '@/app/frontend_manager/manager_members/members_new_admission/mocks/manager_members_new_admission_fixtures/ManagerMembersNewAdmissionFixtures';

/** Read-only fixtures only. No create handler is registered without a supplied mutation contract. */
const TEST_REQUEST_ID = 'msw-members-new-admission';

export const managerStudentsHandlers = [
  http.get(MANAGER_MEMBERS_NEW_ADMISSION_API.LIST, () => HttpResponse.json({
    success: true,
    message: 'Students loaded.',
    data: managerStudentsMockState,
    requestId: TEST_REQUEST_ID,
  })),
  http.get('/students/:id', ({ params }) => {
    const student = managerStudentsMockState.find((record) => record.id === params.id || record.smartId === params.id);
    if (!student) {
      return HttpResponse.json({
        success: false,
        message: 'Student not found',
        data: null,
        error: 'Student not found',
        errorCode: 'STUDENT_NOT_FOUND',
        statusCode: 404,
        requestId: TEST_REQUEST_ID,
      }, { status: 404 });
    }
    return HttpResponse.json({
      success: true,
      message: 'Student loaded.',
      data: student,
      requestId: TEST_REQUEST_ID,
    });
  }),
];
