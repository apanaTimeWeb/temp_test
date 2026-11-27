import { expect, test } from '@playwright/test';

test('redirects superadmin_integrations to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_integrations');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_integrations(?:\/integrations_overview)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads integrations_overview', async ({ page }) => {
  await page.goto('/superadmin/superadmin_integrations/integrations_overview');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_integrations\/integrations_overview(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
