import { expect, test } from '@playwright/test';

test('redirects admin_seats_shifts_lockers to its canonical default submodule', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers');
  await expect(page).toHaveURL(/\/admin\/admin_seats_shifts_lockers\/seats_matrix(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

for (const route of [
  '/admin/admin_seats_shifts_lockers/seats_matrix',
  '/admin/admin_seats_shifts_lockers/seats_management',
  '/admin/admin_seats_shifts_lockers/shifts_management',
  '/admin/admin_seats_shifts_lockers/shifts_gap',
  '/admin/admin_seats_shifts_lockers/lockers_matrix',
]) {
  test(`direct route loads ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#]|$)`));
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
}
