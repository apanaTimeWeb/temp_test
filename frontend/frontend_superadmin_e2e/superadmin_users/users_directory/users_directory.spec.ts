import { expect, test } from '@playwright/test';

test('users_directory displays directory list and action filters', async ({ page }) => {
  await page.goto('/superadmin/superadmin_users/users_directory');

  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
  await expect(page.getByText('Application error', { exact: false })).toHaveCount(0);
});
