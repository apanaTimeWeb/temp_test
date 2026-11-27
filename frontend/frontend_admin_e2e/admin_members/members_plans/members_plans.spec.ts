import { expect, test } from '@playwright/test';

test('demo plans support local create and delete operations', async ({ page }) => {
  test.skip(process.env.PLAYWRIGHT_APP_MODE !== 'demo', 'Requires PLAYWRIGHT_APP_MODE=demo and a server built with NEXT_PUBLIC_FRONTEND_DEMO_MODE=true.');
  await page.goto('/admin/admin_members/members_plans');
  await page.getByRole('button', { name: /Create Plan/i }).click();
  await page.getByLabel('Plan Name').fill('Demo QA Plan');
  await page.getByRole('spinbutton', { name: /Price/i }).fill('1499');
  await page.getByLabel('Duration').fill('30 days');
  await page.getByRole('spinbutton', { name: /Validity/i }).fill('30');
  await page.getByRole('textbox', { name: /Features/i }).fill('Seat access\nLocker access');
  await page.getByTestId('admin_plans-AdminMembersPlansMain-control-010').click();
  await expect(page.getByRole('heading', { level: 3, name: 'Demo QA Plan' })).toBeVisible();
  await page.getByRole('button', { name: /Delete Demo QA Plan/i }).click();
  await page.getByTestId('admin_plans-AdminMembersPlansMain-control-014').click();
  await expect(page.getByRole('heading', { level: 3, name: 'Demo QA Plan' })).toHaveCount(0);
});
