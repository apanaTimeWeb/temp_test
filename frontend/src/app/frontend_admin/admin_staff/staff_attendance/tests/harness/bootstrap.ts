import { http, HttpResponse } from 'msw';
import {
  ADMIN_STAFF_ATTENDANCE_FIXTURES,
  ADMIN_STAFF_ROSTER_FIXTURES,
} from '@/app/frontend_admin/admin_staff/staff_attendance/mocks/scenarios/admin_staff_attendance.scenarios';
import { ADMIN_STAFF_ATTENDANCE_API } from '@/app/frontend_admin/admin_staff/staff_attendance/config/admin_staff_attendance.url_config';

export const ADMIN_STAFF_ATTENDANCE_MSW_HANDLERS = [
  http.get(ADMIN_STAFF_ATTENDANCE_API.LIST, () =>
    HttpResponse.json({
      success: true,
      data: ADMIN_STAFF_ATTENDANCE_FIXTURES,
    })
  ),
  http.get(ADMIN_STAFF_ATTENDANCE_API.ROSTER, () =>
    HttpResponse.json({
      success: true,
      data: ADMIN_STAFF_ROSTER_FIXTURES,
    })
  ),
];

