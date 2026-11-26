import { expect, test } from '@playwright/test';

test('redirects superadmin_plans to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_plans');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_plans(?:\/plans_pricing_catalog)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads plans_pricing_catalog', async ({ page }) => {
  await page.goto('/superadmin/superadmin_plans/plans_pricing_catalog');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_plans\/plans_pricing_catalog(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads plans_promotions', async ({ page }) => {
  await page.goto('/superadmin/superadmin_plans/plans_promotions');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_plans\/plans_promotions(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
