import { http, HttpResponse } from 'msw';
import { ADMIN_SEAT_MATRIX_URLS } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/config/admin_seats_matrix.url_config';


/** Module-owned synthetic API response fixtures for tests/MSW only. */
export const ADMIN_SEAT_MATRIX_API_LOCKERS_FIXTURE = [
  { id: 'locker-demo-01', lockerNumber: 'A01', isActive: true },
  { id: 'locker-demo-02', lockerNumber: 'A02', isActive: true },
  { id: 'locker-demo-03', lockerNumber: 'B01', isActive: false },
];

export const ADMIN_SEAT_MATRIX_API_SEATS_FIXTURE = [
  { id: 'seat-demo-01', seatNumber: 'S-01', isActive: true, status: 'Working', student: 'Demo Student 1', smartId: 'DEMO-001', shift: 'Morning', locker: 'A01' },
  { id: 'seat-demo-02', seatNumber: 'S-02', isActive: false, status: 'Maintenance', student: '', smartId: '', shift: 'Evening', locker: 'A02' },
  { id: 'seat-demo-03', seatNumber: 'S-03', isActive: true, status: 'Working', student: 'Demo Student 2', smartId: 'DEMO-002', shift: 'Full Day', locker: '' },
];

/** Test-only contract handlers; the data is synthetic and not persisted. */
export const ADMIN_SEAT_MATRIX_MSW_HANDLERS = [
  http.get(ADMIN_SEAT_MATRIX_URLS.LOCKERS, () => HttpResponse.json({ success: true, message: 'Synthetic locker fixture loaded.', data: ADMIN_SEAT_MATRIX_API_LOCKERS_FIXTURE, requestId: 'mock-seats-matrix-lockers' })),
  http.get(ADMIN_SEAT_MATRIX_URLS.SEAT_MATRIX, () => HttpResponse.json({ success: true, message: 'Synthetic seat matrix fixture loaded.', data: ADMIN_SEAT_MATRIX_API_SEATS_FIXTURE, requestId: 'mock-seats-matrix-seat-matrix' })),
];
