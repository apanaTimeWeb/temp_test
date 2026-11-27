import { expect, test } from '@playwright/test';

test('redirects superadmin_subscriptions to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_subscriptions');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_subscriptions(?:\/subscriptions_overview)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads subscriptions_overview', async ({ page }) => {
  await page.goto('/superadmin/superadmin_subscriptions/subscriptions_overview');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_subscriptions\/subscriptions_overview(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads subscriptions_active_subscribers', async ({ page }) => {
  await page.goto('/superadmin/superadmin_subscriptions/subscriptions_active_subscribers');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_subscriptions\/subscriptions_active_subscribers(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
