import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('staff_payroll E2E', () => {
  test('switches payroll months, searches records, and shows bulk disburse control', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_staff/staff_payroll', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(6);

    await main.getByRole('button', { name: 'October 2026', exact: true }).click();
    await main.getByRole('button', { name: 'September 2026', exact: true }).click();
    await main.getByRole('button', { name: 'November 2026', exact: true }).click();
    await expect(main.locator('tbody tr')).toHaveCount(6);
    await expect(page.getByTestId('admin-staff-payroll-bulk-disburse-btn')).toBeVisible();
  });
});
