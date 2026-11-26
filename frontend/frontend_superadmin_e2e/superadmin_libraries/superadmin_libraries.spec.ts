import { expect, test } from '@playwright/test';

test('redirects superadmin_libraries to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_libraries');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_libraries(?:\/libraries_overview)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads libraries_overview', async ({ page }) => {
  await page.goto('/superadmin/superadmin_libraries/libraries_overview');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_libraries\/libraries_overview(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads libraries_onboarding_setup', async ({ page }) => {
  await page.goto('/superadmin/superadmin_libraries/libraries_onboarding_setup');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_libraries\/libraries_onboarding_setup(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads libraries_profile_configuration', async ({ page }) => {
  await page.goto('/superadmin/superadmin_libraries/libraries_profile_configuration');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_libraries\/libraries_profile_configuration(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
