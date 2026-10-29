import { expect, test } from '@playwright/test';

test.describe('Manager seats shifts lockers — module E2E contract', () => {
  test('canonical Shifts Management route renders its own contract warning inside the Manager shell', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_seats_shifts_lockers/shifts_management');
    expect(response, 'Module navigation must return a document response').not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    expect(new URL(page.url()).pathname).toBe('/frontend_manager/manager_seats_shifts_lockers/shifts_management');
    await expect(page.getByTestId('manager-role-shell')).toBeVisible();
    await expect(page.getByTestId('manager-main-content')).toBeVisible();
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Shifts' })).toBeVisible();
    await expect(page.getByTestId('manager-seats-contract-warning')).toBeVisible();
  });
});
