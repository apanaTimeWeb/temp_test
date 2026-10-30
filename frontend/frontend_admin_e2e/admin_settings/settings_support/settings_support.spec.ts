import { expect, test } from '@playwright/test';

test('demo support ticket validation produces a local ticket confirmation without claiming server persistence', async ({ page }) => {
  test.skip(process.env.PLAYWRIGHT_APP_MODE !== 'demo', 'Requires PLAYWRIGHT_APP_MODE=demo and a server built with NEXT_PUBLIC_FRONTEND_DEMO_MODE=true.');
  await page.goto('/admin/admin_settings/settings_support');
  await page.getByRole('button', { name: /Create ticket/i }).click();
  await page.getByLabel(/Subject/i).fill('Demo QA ticket');
  await page.getByLabel(/Description/i).fill('This ticket is used to verify local demo creation.');
  await page.getByRole('button', { name: /Create ticket in demo/i }).click();
  await expect(page.getByRole('heading', { name: /Demo ticket created/i })).toBeVisible();
  await expect(page.getByText(/SUP-DEMO-/)).toBeVisible();
  await expect(page.getByText(/not sent to a support service/i)).toBeVisible();
});
