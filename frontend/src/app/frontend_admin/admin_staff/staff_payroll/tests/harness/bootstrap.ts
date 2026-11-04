import { http, HttpResponse } from 'msw';
import { ADMIN_STAFF_PAYROLL_FIXTURES } from '@/app/frontend_admin/admin_staff/staff_payroll/mocks/scenarios/admin_staff_payroll.scenarios';
import { ADMIN_STAFF_PAYROLL_API } from '@/app/frontend_admin/admin_staff/staff_payroll/config/admin_staff_payroll.url_config';

export const ADMIN_STAFF_PAYROLL_MSW_HANDLERS = [
  http.get(ADMIN_STAFF_PAYROLL_API.LIST, () =>
    HttpResponse.json({
      success: true,
      data: ADMIN_STAFF_PAYROLL_FIXTURES,
    })
  ),
];

