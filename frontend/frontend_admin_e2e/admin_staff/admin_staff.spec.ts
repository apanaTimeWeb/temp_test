import { expect, test } from '@playwright/test';

test('redirects admin_staff to its canonical default submodule', async ({ page }) => {
  await page.goto('/admin/admin_staff');
  await expect(page).toHaveURL(/\/admin\/admin_staff\/staff_directory(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

for (const route of [
  '/admin/admin_staff/staff_directory',
  '/admin/admin_staff/staff_attendance',
  '/admin/admin_staff/staff_payroll',
]) {
  test(`direct route loads ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#]|$)`));
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
}
