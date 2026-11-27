import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('members_blacklist E2E', () => {
  test('renders blacklist records, filters search, and opens Blacklist Student dialog', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_members/members_blacklist', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(3);

    await main.getByRole('button', { name: /Blacklist Student/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});
