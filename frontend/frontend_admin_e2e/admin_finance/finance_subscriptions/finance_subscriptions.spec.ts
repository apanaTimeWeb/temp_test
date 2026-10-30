import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../../frontend_admin/package.json', import.meta.url));
const { expect, test } = require('@playwright/test');

test('loads the canonical finance_subscriptions submodule route', async ({ page }) => {
  await page.goto('/admin/admin_finance/finance_subscriptions');
  await expect(page).toHaveURL(new RegExp('\\/admin\\/admin_finance\\/finance_subscriptions(?:[?#]|$)'));
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('demo finance_subscriptions CSV export downloads a file', async ({ page }) => {
  test.skip(process.env.PLAYWRIGHT_APP_MODE !== 'demo', 'Requires PLAYWRIGHT_APP_MODE=demo and a server built with NEXT_PUBLIC_FRONTEND_DEMO_MODE=true.');
  await page.goto('/admin/admin_finance/finance_subscriptions');
  await expect(page.getByRole('heading', { name: /subscriptions/i }).first()).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('admin_subscriptions-page-control-002').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^admin-subscriptions-\d{4}-\d{2}-\d{2}\.csv$/);
});
