import { http, HttpResponse } from 'msw';
import { MANAGER_SEATS_MATRIX_API } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/config/manager_seats_matrix.url_config';
import {
  MANAGER_SEATS_SHIFTS_LOCKERS_ALLOCATIONS_FIXTURE,
  MANAGER_SEATS_SHIFTS_LOCKERS_EMPTY_FIXTURE,
  MANAGER_SEATS_SHIFTS_LOCKERS_HISTORY_FIXTURE,
  MANAGER_SEATS_SHIFTS_LOCKERS_LOCKERS_FIXTURE,
  MANAGER_SEATS_SHIFTS_LOCKERS_SEAT_MATRIX_FIXTURE,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/mocks/manager_seats_matrix_fixtures/ManagerSeatsMatrixApiFixtures';

const TEST_REQUEST_ID = 'msw-manager-seats-shifts-lockers';

export function managerSeatsShiftsLockersTestResponse(request: Request, populated: Record<string, unknown>[]) {
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
  return HttpResponse.json(mode === 'empty' ? MANAGER_SEATS_SHIFTS_LOCKERS_EMPTY_FIXTURE : populated);
}

/** Read-only handlers mirror only existing GET URLs; no allocation or migration writes are invented. */
export const managerSeatsShiftsLockersHandlers = [
  http.get(`*${MANAGER_SEATS_MATRIX_API.SEAT_MATRIX}`, ({ request }) => managerSeatsShiftsLockersTestResponse(request, MANAGER_SEATS_SHIFTS_LOCKERS_SEAT_MATRIX_FIXTURE)),
  http.get(`*${MANAGER_SEATS_MATRIX_API.LOCKERS}`, ({ request }) => managerSeatsShiftsLockersTestResponse(request, MANAGER_SEATS_SHIFTS_LOCKERS_LOCKERS_FIXTURE)),
  http.get(`*${MANAGER_SEATS_MATRIX_API.ALLOCATIONS}`, ({ request }) => managerSeatsShiftsLockersTestResponse(request, MANAGER_SEATS_SHIFTS_LOCKERS_ALLOCATIONS_FIXTURE)),
  http.get(`*${MANAGER_SEATS_MATRIX_API.HISTORY}`, ({ request }) => managerSeatsShiftsLockersTestResponse(request, MANAGER_SEATS_SHIFTS_LOCKERS_HISTORY_FIXTURE)),
];
