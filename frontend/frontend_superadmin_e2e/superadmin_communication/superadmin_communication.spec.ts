import { expect, test } from '@playwright/test';

test('redirects superadmin_communication to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_communication');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_communication(?:\/communication_notification_center)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads communication_notification_center', async ({ page }) => {
  await page.goto('/superadmin/superadmin_communication/communication_notification_center');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_communication\/communication_notification_center(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads communication_notices', async ({ page }) => {
  await page.goto('/superadmin/superadmin_communication/communication_notices');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_communication\/communication_notices(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
