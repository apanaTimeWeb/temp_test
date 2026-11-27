import { test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('staff_payroll E2E', () => {
  test('loads Staff Payroll & Salaries page and search cleanly', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_staff/staff_payroll', { checkSearchInput: true });
  });
});
