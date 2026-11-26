import { expect, test } from '@playwright/test';

test('redirects superadmin_settings to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_settings');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_settings(?:\/settings_general)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads settings_general', async ({ page }) => {
  await page.goto('/superadmin/superadmin_settings/settings_general');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_settings\/settings_general(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads settings_branding', async ({ page }) => {
  await page.goto('/superadmin/superadmin_settings/settings_branding');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_settings\/settings_branding(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads settings_library_configuration', async ({ page }) => {
  await page.goto('/superadmin/superadmin_settings/settings_library_configuration');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_settings\/settings_library_configuration(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
