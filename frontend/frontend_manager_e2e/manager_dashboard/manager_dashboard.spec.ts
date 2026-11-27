import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_dashboard domain E2E', () => {
  test('dashboard_overview renders live floor operations and passes responsive check', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_dashboard/dashboard_overview',
      { checkNoHorizontalOverflow: true },
    );

    const floorSection = page.getByLabel('Live Shift and Floor Operations');
    await expect(floorSection).toBeVisible();
  });

  test('dashboard_reports renders inside shell cleanly on desktop and mobile', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_dashboard/dashboard_reports',
      { checkNoHorizontalOverflow: true },
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(page.getByRole('heading').first()).toBeVisible();
    const overflowPx = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflowPx).toBeLessThanOrEqual(2);
  });
});
