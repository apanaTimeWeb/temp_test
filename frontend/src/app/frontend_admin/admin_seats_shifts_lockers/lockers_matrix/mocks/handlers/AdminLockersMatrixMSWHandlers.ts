import { ADMIN_LOCKERS_URLS } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/config/admin_lockers_matrix_lockers_url_config_source_routes';
import { http,HttpResponse } from 'msw';

/** Returns the source-supported empty list for the lockers matrix contract; no synthetic live entities are invented. */
export const ADMIN_LOCKERS_MATRIX_MSW_HANDLERS = [
  http.get(`*${ADMIN_LOCKERS_URLS.LOCKERS}`, () => HttpResponse.json({
    success: true,
    message: 'Synthetic empty lockers fixture loaded.',
    data: [],
    requestId: 'mock-lockers-matrix-lockers',
  })),
];
