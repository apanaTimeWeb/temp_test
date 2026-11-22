import { expect, test } from '@playwright/test';

test('demo plans support local create and delete operations', async ({ page }) => {
  test.skip(process.env.PLAYWRIGHT_APP_MODE !== 'demo', 'Requires PLAYWRIGHT_APP_MODE=demo and a server built with NEXT_PUBLIC_FRONTEND_DEMO_MODE=true.');
  await page.goto('/admin/admin_members/members_plans');
  await page.getByRole('button', { name: /Create Plan/i }).click();
  await page.getByLabel('Plan Name').fill('Demo QA Plan');
  await page.getByLabel('Price').fill('1499');
  await page.getByLabel('Duration').fill('30 days');
  await page.getByLabel('Validity Days').fill('30');
  await page.getByLabel(/Features/i).fill('Seat access\nLocker access');
  await page.getByTestId('admin_plans-AdminPlansMain-control-010').click();
  await expect(page.getByText('Demo QA Plan')).toBeVisible();
  await page.getByRole('button', { name: 'Delete' }).first().click();
  await page.getByTestId('admin_plans-AdminPlansMain-control-014').click();
  await expect(page.getByText('Demo QA Plan')).toHaveCount(0);
});
