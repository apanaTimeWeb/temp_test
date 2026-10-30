import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../frontend_admin/package.json', import.meta.url));
const { expect, test } = require('@playwright/test');

test('redirects admin_finance to its canonical default submodule', async ({ page }) => {
  await page.goto('/admin/admin_finance');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_collect_fee(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('direct route loads finance_collect_fee', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_collect_fee');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_collect_fee(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads finance_subscriptions', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_subscriptions');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_subscriptions(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads finance_renewals', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_renewals');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_renewals(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads finance_payments', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_payments');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_payments(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads finance_payment_promises', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_payment_promises');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_payment_promises(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads finance_security_deposits', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_security_deposits');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_security_deposits(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads finance_late_fees', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_late_fees');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_late_fees(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads finance_auto_suspend', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_auto_suspend');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_auto_suspend(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads finance_invoices', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_invoices');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_invoices(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads finance_receipts', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_receipts');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_receipts(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads finance_refunds', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_refunds');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_refunds(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads finance_trust_score', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_trust_score');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_trust_score(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads finance_referrals', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_referrals');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_referrals(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads finance_dashboard', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_dashboard');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_dashboard(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});
