import { expect, test } from '@playwright/test';
test('redirects admin_seats_shifts_lockers to its canonical default submodule', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers');
  await expect(page).toHaveURL(/\/admin\/admin_seats_shifts_lockers\/seats_matrix(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('direct route loads seats_matrix', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers/seats_matrix');
  await expect(page).toHaveURL(/\/admin\/admin_seats_shifts_lockers\/seats_matrix(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads seats_management', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers/seats_management');
  await expect(page).toHaveURL(/\/admin\/admin_seats_shifts_lockers\/seats_management(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads seats_history', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers/seats_history');
  await expect(page).toHaveURL(/\/admin\/admin_seats_shifts_lockers\/seats_history(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads seats_maintenance', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers/seats_maintenance');
  await expect(page).toHaveURL(/\/admin\/admin_seats_shifts_lockers\/seats_maintenance(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads shifts_management', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers/shifts_management');
  await expect(page).toHaveURL(/\/admin\/admin_seats_shifts_lockers\/shifts_management(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads shifts_migration', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers/shifts_migration');
  await expect(page).toHaveURL(/\/admin\/admin_seats_shifts_lockers\/shifts_migration(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads shifts_gap', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers/shifts_gap');
  await expect(page).toHaveURL(/\/admin\/admin_seats_shifts_lockers\/shifts_gap(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads allocations', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers/allocations');
  await expect(page).toHaveURL(/\/admin\/admin_seats_shifts_lockers\/allocations(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads lockers_management', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers/lockers_management');
  await expect(page).toHaveURL(/\/admin\/admin_seats_shifts_lockers\/lockers_management(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads lockers_matrix', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers/lockers_matrix');
  await expect(page).toHaveURL(/\/admin\/admin_seats_shifts_lockers\/lockers_matrix(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});
