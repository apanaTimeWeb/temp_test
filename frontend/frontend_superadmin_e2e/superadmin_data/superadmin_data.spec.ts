import { expect, test } from '@playwright/test';

test('loads superadmin_data default submodule via rewrite or redirect', async ({ page }) => {
  await page.goto('/superadmin/superadmin_data');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_data(?:\/data_overview)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads data_overview', async ({ page }) => {
  await page.goto('/superadmin/superadmin_data/data_overview');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_data\/data_overview(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads data_backup_operations', async ({ page }) => {
  await page.goto('/superadmin/superadmin_data/data_backup_operations');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_data\/data_backup_operations(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads data_restore_operations', async ({ page }) => {
  await page.goto('/superadmin/superadmin_data/data_restore_operations');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_data\/data_restore_operations(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads data_export_management', async ({ page }) => {
  await page.goto('/superadmin/superadmin_data/data_export_management');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_data\/data_export_management(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads data_import_migration', async ({ page }) => {
  await page.goto('/superadmin/superadmin_data/data_import_migration');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_data\/data_import_migration(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads data_archive_retention', async ({ page }) => {
  await page.goto('/superadmin/superadmin_data/data_archive_retention');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_data\/data_archive_retention(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
