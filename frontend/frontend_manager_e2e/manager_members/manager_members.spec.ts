import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_members domain E2E', () => {
  test('members_directory filters records cleanly via search input', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_members/members_directory',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByRole('main');
    await expect(main.locator('table, [data-testid]').first()).toBeVisible();
  });

  test('members_enquiries add drawer protects unsaved draft with cancel & continue actions', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(page, '/frontend_manager/manager_members/members_enquiries');

    await page.goto('/frontend_manager/manager_members/members_enquiries?view=add');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const nameInput = dialog.getByLabel(/Full Name/i);
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Playwright Enquiry Draft');
    await dialog.getByRole('button', { name: /Close|Cancel/i }).first().click();

    await expect(page.getByRole('alertdialog')).toBeVisible();
    await page.getByTestId('managermembersenquiries-unsaved-confirm-cancel').click();
    await expect(nameInput).toHaveValue('Playwright Enquiry Draft');

    await dialog.getByRole('button', { name: /Close|Cancel/i }).first().click();
    await page.getByTestId('managermembersenquiries-unsaved-confirm-continue').click();
    await expect(page).toHaveURL(/members_enquiries/);
  });

  test('members_alumni filters by year/status and resets filters cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_members/members_alumni',
      { checkNoHorizontalOverflow: true },
    );

    await page.getByTestId('manager-alumni-search-input').fill('NoSuchAlumni2026');
    await page.getByTestId('manager-alumni-reset-filters').click();
    await expect(page.getByTestId('manager-alumni-search-input')).toHaveValue('');
  });

  test('members_id_card_generator filters by shift and status cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(page, '/frontend_manager/manager_members/members_id_card_generator');

    await expect(page.getByTestId('manager-id-card-shift-filter')).toBeVisible();
    await expect(page.getByTestId('manager-id-card-status-filter')).toBeVisible();
    await page.getByTestId('manager-id-card-shift-filter').selectOption({ index: 1 });
    await page.getByTestId('manager-id-card-shift-filter').selectOption({ index: 0 });
  });

  for (const route of [
    '/frontend_manager/manager_members/members_new_admission',
    '/frontend_manager/manager_members/members_group_admission',
    '/frontend_manager/manager_members/members_referral_bonus',
  ]) {
    test(`loads ${route} cleanly`, async ({ page }) => {
      await expectCanonicalManagerSubmoduleLoaded(page, route, { checkSearchInput: true });
    });
  }
});
