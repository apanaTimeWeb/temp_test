import { expect, test } from '@playwright/test';

test('redirects superadmin_support to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_support');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_support(?:\/support_tickets)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads support_tickets', async ({ page }) => {
  await page.goto('/superadmin/superadmin_support/support_tickets');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_support\/support_tickets(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
