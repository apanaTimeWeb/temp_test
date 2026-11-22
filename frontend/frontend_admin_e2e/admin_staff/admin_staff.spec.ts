import { expect, test } from '@playwright/test';
test('redirects admin_staff to its canonical default submodule', async ({ page }) => {
  await page.goto('/admin/admin_staff');
  await expect(page).toHaveURL(/\/admin\/admin_staff\/staff_directory(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('direct route loads staff_directory', async ({ page }) => {
  await page.goto('/admin/admin_staff/staff_directory');
  await expect(page).toHaveURL(/\/admin\/admin_staff\/staff_directory(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads staff_roles_permissions', async ({ page }) => {
  await page.goto('/admin/admin_staff/staff_roles_permissions');
  await expect(page).toHaveURL(/\/admin\/admin_staff\/staff_roles_permissions(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});
