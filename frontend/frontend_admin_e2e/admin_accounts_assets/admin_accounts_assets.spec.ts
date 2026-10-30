import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../frontend_admin/package.json', import.meta.url));
const { expect, test } = require('@playwright/test');

test('redirects admin_accounts_assets to its canonical default submodule', async ({ page }) => {
  await page.goto('/admin/admin_accounts_assets');
  await expect(page).toHaveURL(/\/admin\/admin_accounts_assets\/accounts_expenses(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('direct route loads accounts_expenses', async ({ page }) => {
  await page.goto('/admin/admin_accounts_assets/accounts_expenses');
  await expect(page).toHaveURL(/\/admin\/admin_accounts_assets\/accounts_expenses(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads accounts_expense_categories', async ({ page }) => {
  await page.goto('/admin/admin_accounts_assets/accounts_expense_categories');
  await expect(page).toHaveURL(/\/admin\/admin_accounts_assets\/accounts_expense_categories(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads accounts_daily_settlement', async ({ page }) => {
  await page.goto('/admin/admin_accounts_assets/accounts_daily_settlement');
  await expect(page).toHaveURL(/\/admin\/admin_accounts_assets\/accounts_daily_settlement(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads accounts_financial_reports', async ({ page }) => {
  await page.goto('/admin/admin_accounts_assets/accounts_financial_reports');
  await expect(page).toHaveURL(/\/admin\/admin_accounts_assets\/accounts_financial_reports(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads accounts_seat_gap_report', async ({ page }) => {
  await page.goto('/admin/admin_accounts_assets/accounts_seat_gap_report');
  await expect(page).toHaveURL(/\/admin\/admin_accounts_assets\/accounts_seat_gap_report(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads accounts_shift_gap_analyzer', async ({ page }) => {
  await page.goto('/admin/admin_accounts_assets/accounts_shift_gap_analyzer');
  await expect(page).toHaveURL(/\/admin\/admin_accounts_assets\/accounts_shift_gap_analyzer(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads assets_register', async ({ page }) => {
  await page.goto('/admin/admin_accounts_assets/assets_register');
  await expect(page).toHaveURL(/\/admin\/admin_accounts_assets\/assets_register(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads assets_maintenance', async ({ page }) => {
  await page.goto('/admin/admin_accounts_assets/assets_maintenance');
  await expect(page).toHaveURL(/\/admin\/admin_accounts_assets\/assets_maintenance(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});
