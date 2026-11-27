import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('staff_attendance E2E', () => {
  test('filters attendance logs and switches Roster & Leave Requests views cleanly', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_staff/staff_attendance', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(7);

    const statusSelect = main.locator('select').nth(0);
    await statusSelect.selectOption('LATE');
    expect(await main.locator('tbody tr').count()).toBeLessThanOrEqual(7);
    await statusSelect.selectOption('all');
    await expect(main.locator('tbody tr')).toHaveCount(7);

    await main.getByRole('button', { name: 'Shift Duty Roster', exact: true }).click();
    await main.getByRole('button', { name: 'Leave Requests', exact: true }).click();
    await main.getByRole('button', { name: 'Daily Attendance Logs', exact: true }).click();
    await expect(main.locator('tbody tr')).toHaveCount(7);
  });
});
