import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('communication_whatsapp_templates E2E', () => {
  test('filters WhatsApp templates by category and opens template editor modal', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_communication/communication_whatsapp_templates', { checkSearchInput: true });

    const main = page.getByRole('main');
    await main.getByRole('button', { name: 'Onboarding', exact: true }).click();
    await main.getByRole('button', { name: 'Announcements', exact: true }).click();
    await main.getByRole('button', { name: /All Categories/i }).click();

    await page.getByTestId('admin_communication-add-template-btn').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
