import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_dashboard domain E2E', () => {
  test('dashboard_overview renders live floor operations, switches time horizons, and passes responsive check', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_dashboard/dashboard_overview',
      { checkNoHorizontalOverflow: true },
    );

    await expect(page.getByLabel('Live Shift and Floor Operations')).toBeVisible();
    await page.getByRole('button', { name: 'This Week', exact: true }).click();
    await expect(page.getByText('Showing current week (7 days)')).toBeVisible();

    await page.getByRole('button', { name: 'This Month', exact: true }).click();
    await expect(page.getByText('Showing current month (30 days)')).toBeVisible();

    await page.getByRole('button', { name: 'Custom Range', exact: true }).click();
    await expect(page.locator('input[type="date"]').first()).toBeVisible();

    await page.getByRole('button', { name: 'Today', exact: true }).click();
    await expect(page.getByText("Showing today's live operations")).toBeVisible();
  });

  test('dashboard_reports changes date range scope, renders report tables, and holds mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_dashboard/dashboard_reports',
      { checkNoHorizontalOverflow: true },
    );

    const rangeSelect = page.locator('#manager-reports-date-range');
    await expect(rangeSelect).toBeAttached();
    await page.getByRole('button', { name: 'This Week', exact: true }).click();
    await expect(rangeSelect).toHaveValue('This Week');
    await page.getByRole('button', { name: 'Last 30 Days', exact: true }).click();
    await expect(rangeSelect).toHaveValue('Last 30 Days');

    await expect(page.getByRole('columnheader', { name: /Shift Tier/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Gross Monthly Revenue/i })).toBeVisible();
    const rowCount = await page.getByRole('main').locator('tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Branch Performance & Reports' })).toBeVisible();
    const overflowPx = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflowPx).toBeLessThanOrEqual(2);
  });
});
