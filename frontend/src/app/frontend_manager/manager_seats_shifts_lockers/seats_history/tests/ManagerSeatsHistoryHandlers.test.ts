import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import { MANAGER_SEATS_HISTORY_API } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/config/manager_seats_history.url_config';
import {
  MANAGER_SEATS_SHIFTS_LOCKERS_ALLOCATIONS_FIXTURE,
  MANAGER_SEATS_SHIFTS_LOCKERS_HISTORY_FIXTURE,
  MANAGER_SEATS_SHIFTS_LOCKERS_LOCKERS_FIXTURE,
  MANAGER_SEATS_SHIFTS_LOCKERS_SEAT_MATRIX_FIXTURE,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/mocks/manager_seats_history_fixtures/ManagerSeatsHistoryApiFixtures';
import { managerSeatsShiftsLockersHandlers } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/mocks/manager_seats_history_handlers/ManagerSeatsHistoryHandlers';
import { normalizeManagerSeatsAllocationStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/utils/ManagerSeatsHistoryStatusNormalization';
import { normalizeManagerLockerMatrixStatus, normalizeManagerSeatMatrixStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/utils/ManagerSeatsHistoryMatrixStatus';

const server = setupServer(...managerSeatsShiftsLockersHandlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Manager Seats/Shifts/Lockers read-only MSW fixtures', () => {
  it('serves mapper-compatible payloads from all four existing GET URLs', async () => {
    const paths = [MANAGER_SEATS_HISTORY_API.SEAT_MATRIX, MANAGER_SEATS_HISTORY_API.LOCKERS, MANAGER_SEATS_HISTORY_API.ALLOCATIONS, MANAGER_SEATS_HISTORY_API.HISTORY];
    const responses = await Promise.all(paths.map((url) => fetch(`http://localhost${url}`)));
    expect(responses.every((response) => response.ok)).toBe(true);
    const [seats, lockers, allocations, history] = await Promise.all(responses.map((response) => response.json()));
    expect(seats).toEqual(MANAGER_SEATS_SHIFTS_LOCKERS_SEAT_MATRIX_FIXTURE);
    expect(lockers).toEqual(MANAGER_SEATS_SHIFTS_LOCKERS_LOCKERS_FIXTURE);
    expect(allocations).toEqual(MANAGER_SEATS_SHIFTS_LOCKERS_ALLOCATIONS_FIXTURE);
    expect(history).toEqual(MANAGER_SEATS_SHIFTS_LOCKERS_HISTORY_FIXTURE);
    expect(allocations.every((row: Record<string, unknown>) => ['id', 'studentName', 'smartId', 'seatNo', 'shift', 'validFrom', 'validTill'].every((key) => typeof row[key] === 'string' && String(row[key]).trim().length > 0) && typeof row.daysLeft === 'number' && Number.isFinite(row.daysLeft))).toBe(true);
  });

  it('serves empty/error states through an existing GET handler only', async () => {
    const emptyResponse = await fetch(`http://localhost${MANAGER_SEATS_HISTORY_API.SEAT_MATRIX}?__testMode=empty`);
    const errorResponse = await fetch(`http://localhost${MANAGER_SEATS_HISTORY_API.SEAT_MATRIX}?__testMode=error`);
    expect(await emptyResponse.json()).toEqual([]);
    expect(errorResponse.status).toBe(503);
    expect(managerSeatsShiftsLockersHandlers).toHaveLength(4);
  });

  it('keeps unrecognized statuses unknown rather than implying a successful state', () => {
    expect(normalizeManagerSeatMatrixStatus('future-status-test')).toBe('unknown');
    expect(normalizeManagerLockerMatrixStatus('future-status-test')).toBe('unknown');
    expect(normalizeManagerSeatsAllocationStatus('UnrecognizedTestStatus')).toBe('unknown');
  });
});
