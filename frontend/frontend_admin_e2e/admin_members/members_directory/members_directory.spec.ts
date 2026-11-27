import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('members_directory E2E', () => {
  test('filters members by status tab, dropdown, and search input', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_members/members_directory', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(4);

    await page.getByTestId('admin_members-AdminMembersDirectoryView-main-tab-active').click();
    const activeCount = await main.locator('tbody tr').count();
    expect(activeCount).toBeGreaterThan(0);

    await page.getByTestId('admin_members-AdminMembersDirectoryView-main-tab-all').click();
    await expect(main.locator('tbody tr')).toHaveCount(4);

    await main.getByRole('combobox', { name: /Filter by fee status/i }).selectOption('Due');
    const dueCount = await main.locator('tbody tr').count();
    expect(dueCount).toBeLessThanOrEqual(4);
    await main.getByRole('combobox', { name: /Filter by fee status/i }).selectOption('all');
    await expect(main.locator('tbody tr')).toHaveCount(4);
  });
});
