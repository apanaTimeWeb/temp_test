import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../frontend_admin/package.json', import.meta.url));
const { expect, test } = require('@playwright/test');

test('redirects admin_settings to its canonical default submodule', async ({ page }) => {
  await page.goto('/admin/admin_settings');
  await expect(page).toHaveURL(/\/admin\/admin_settings\/settings_branches(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('direct route loads settings_branches', async ({ page }) => {
  await page.goto('/admin/admin_settings/settings_branches');
  await expect(page).toHaveURL(/\/admin\/admin_settings\/settings_branches(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads settings_security', async ({ page }) => {
  await page.goto('/admin/admin_settings/settings_security');
  await expect(page).toHaveURL(/\/admin\/admin_settings\/settings_security(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads settings_support', async ({ page }) => {
  await page.goto('/admin/admin_settings/settings_support');
  await expect(page).toHaveURL(/\/admin\/admin_settings\/settings_support(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads settings_profile', async ({ page }) => {
  await page.goto('/admin/admin_settings/settings_profile');
  await expect(page).toHaveURL(/\/admin\/admin_settings\/settings_profile(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});
