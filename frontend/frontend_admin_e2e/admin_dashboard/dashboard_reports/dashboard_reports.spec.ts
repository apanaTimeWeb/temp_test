import { createRequire } from 'node:module';

const require = createRequire(new URL('../../../../frontend_admin/package.json', import.meta.url));
const { expect, test } = require('@playwright/test');

test('loads the canonical dashboard reports route', async ({ page }: { page: import('@playwright/test').Page }) => {
  await page.goto('/admin/admin_dashboard/dashboard_reports');
  await expect(page).toHaveURL(/\/admin\/admin_dashboard\/dashboard_reports(?:[?#]|$)/);
  await expect(page.getByRole('group', { name: /reports view selector/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /analytics/i })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('switches to the metadata-only report library and back without route aliases', async ({ page }: { page: import('@playwright/test').Page }) => {
  await page.goto('/admin/admin_dashboard/dashboard_reports');
  await page.getByRole('button', { name: /report library/i }).click();
  await expect(page).toHaveURL(/\/admin\/admin_dashboard\/dashboard_reports(?:[?#]|$)/);
  await expect(page.getByRole('heading', { name: /reports library/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /preserved reports view/i })).toHaveCount(0);
  await page.getByRole('button', { name: /analytics/i }).click();
  await expect(page.getByRole('heading', { name: /reports and analytics/i })).toBeVisible();
});
