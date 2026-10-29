import { expect, test } from '@playwright/test';

test.describe('Manager help support — module E2E contract', () => {
  test('canonical route renders the module inside the Manager shell', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_settings/settings_help_support');
    expect(response, 'Module navigation must return a document response').not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    expect(new URL(page.url()).pathname).toBe('/frontend_manager/manager_settings/settings_help_support');
    await expect(page.getByTestId('manager-role-shell')).toBeVisible();
    await expect(page.getByTestId('manager-main-content')).toBeVisible();
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByTestId('manager-main-content')).not.toBeEmpty();
  await page.getByRole('button', { name: 'Raise a Ticket', exact: true }).click();
  await expect(page.getByTestId('manager-support-ticket-contract-warning')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit unavailable', exact: true })).toBeDisabled();
  });
});
