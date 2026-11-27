import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_communication domain E2E', () => {
  test('communication_whatsapp_logs exposes channel, type, and status filters', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_communication/communication_whatsapp_logs',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    await expect(page.getByLabel('Filter by Channel / Dispatch Mode')).toBeVisible();
    await expect(page.getByLabel('Filter by Type')).toBeVisible();
    await expect(page.getByLabel('Filter by Status')).toBeVisible();
  });

  test('communication_complaints filters by category and searches cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_communication/communication_complaints',
      { checkSearchInput: true },
    );

    await expect(page.getByLabel('Filter by Category')).toBeVisible();
  });

  for (const route of [
    '/frontend_manager/manager_communication/communication_notification_center',
    '/frontend_manager/manager_communication/communication_whatsapp_templates',
  ]) {
    test(`loads ${route} cleanly`, async ({ page }) => {
      await expectCanonicalManagerSubmoduleLoaded(page, route, { checkSearchInput: true });
    });
  }
});
