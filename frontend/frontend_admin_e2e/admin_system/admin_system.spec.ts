import { expect, test } from '@playwright/test';
test('redirects admin_system to its canonical default submodule', async ({ page }) => {
  await page.goto('/admin/admin_system');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_settings(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('direct route loads system_settings', async ({ page }) => {
  await page.goto('/admin/admin_system/system_settings');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_settings(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads system_branding', async ({ page }) => {
  await page.goto('/admin/admin_system/system_branding');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_branding(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads system_backups', async ({ page }) => {
  await page.goto('/admin/admin_system/system_backups');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_backups(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads system_smart_id', async ({ page }) => {
  await page.goto('/admin/admin_system/system_smart_id');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_smart_id(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads system_bulk_import', async ({ page }) => {
  await page.goto('/admin/admin_system/system_bulk_import');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_bulk_import(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads system_data_export', async ({ page }) => {
  await page.goto('/admin/admin_system/system_data_export');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_data_export(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads system_auto_scale', async ({ page }) => {
  await page.goto('/admin/admin_system/system_auto_scale');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_auto_scale(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads system_maintenance', async ({ page }) => {
  await page.goto('/admin/admin_system/system_maintenance');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_maintenance(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads system_offline', async ({ page }) => {
  await page.goto('/admin/admin_system/system_offline');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_offline(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads system_power_saving', async ({ page }) => {
  await page.goto('/admin/admin_system/system_power_saving');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_power_saving(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads system_gap_filling', async ({ page }) => {
  await page.goto('/admin/admin_system/system_gap_filling');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_gap_filling(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads system_waitlist_automation', async ({ page }) => {
  await page.goto('/admin/admin_system/system_waitlist_automation');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_waitlist_automation(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads system_whatsapp_integration', async ({ page }) => {
  await page.goto('/admin/admin_system/system_whatsapp_integration');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_whatsapp_integration(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads system_profile', async ({ page }) => {
  await page.goto('/admin/admin_system/system_profile');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_profile(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads system_audit_logs', async ({ page }) => {
  await page.goto('/admin/admin_system/system_audit_logs');
  await expect(page).toHaveURL(/\/admin\/admin_system\/system_audit_logs(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});
