import { expect, test } from '@playwright/test';
test('redirects admin_communication to its canonical default submodule', async ({ page }) => {
  await page.goto('/admin/admin_communication');
  await expect(page).toHaveURL(/\/admin\/admin_communication\/communication_notices(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('direct route loads communication_notices', async ({ page }) => {
  await page.goto('/admin/admin_communication/communication_notices');
  await expect(page).toHaveURL(/\/admin\/admin_communication\/communication_notices(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads communication_complaints', async ({ page }) => {
  await page.goto('/admin/admin_communication/communication_complaints');
  await expect(page).toHaveURL(/\/admin\/admin_communication\/communication_complaints(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads communication_notification_center', async ({ page }) => {
  await page.goto('/admin/admin_communication/communication_notification_center');
  await expect(page).toHaveURL(/\/admin\/admin_communication\/communication_notification_center(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads communication_whatsapp_templates', async ({ page }) => {
  await page.goto('/admin/admin_communication/communication_whatsapp_templates');
  await expect(page).toHaveURL(/\/admin\/admin_communication\/communication_whatsapp_templates(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads communication_whatsapp_logs', async ({ page }) => {
  await page.goto('/admin/admin_communication/communication_whatsapp_logs');
  await expect(page).toHaveURL(/\/admin\/admin_communication\/communication_whatsapp_logs(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});
