import { expect, test } from '@playwright/test';

test('redirects superadmin_billing to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_billing');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_billing(?:\/billing_invoices)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads billing_invoices', async ({ page }) => {
  await page.goto('/superadmin/superadmin_billing/billing_invoices');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_billing\/billing_invoices(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('legacy route redirects billing_overview to billing_invoices', async ({ page }) => {
  await page.goto('/superadmin/superadmin_billing/billing_overview');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_billing\/billing_invoices(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});
