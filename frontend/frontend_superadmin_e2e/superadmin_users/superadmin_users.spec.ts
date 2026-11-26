import { expect, test } from '@playwright/test';

test('redirects superadmin_users to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_users');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_users(?:\/users_directory)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads users_directory', async ({ page }) => {
  await page.goto('/superadmin/superadmin_users/users_directory');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_users\/users_directory(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads users_roles_permissions', async ({ page }) => {
  await page.goto('/superadmin/superadmin_users/users_roles_permissions');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_users\/users_roles_permissions(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
