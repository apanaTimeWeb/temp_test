import { expect, test } from '@playwright/test';

test('redirects superadmin_system to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_system');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_system(?:\/system_health_overview)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads system_health_overview', async ({ page }) => {
  await page.goto('/superadmin/superadmin_system/system_health_overview');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_system\/system_health_overview(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads system_audit_logs', async ({ page }) => {
  await page.goto('/superadmin/superadmin_system/system_audit_logs');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_system\/system_audit_logs(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
