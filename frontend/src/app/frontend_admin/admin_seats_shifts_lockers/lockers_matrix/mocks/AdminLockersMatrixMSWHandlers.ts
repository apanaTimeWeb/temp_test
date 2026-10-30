import { http, HttpResponse } from 'msw';
import { ADMIN_LOCKERS_URLS } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/config/admin_lockers_matrix_lockers_url_config_source_routes';

/** Returns the source-supported empty list for the matrix contract; no synthetic live entities are invented. */
export const ADMIN_LOCKERS_MATRIX_MSW_HANDLERS = [
  http.get(`*${ADMIN_LOCKERS_URLS.SEAT_MATRIX}`, () => HttpResponse.json({
    success: true,
    message: 'Synthetic empty seat-matrix fixture loaded.',
    data: [],
    requestId: 'mock-lockers-matrix-seat-matrix',
  })),
];
