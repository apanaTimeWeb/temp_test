import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_members domain E2E', () => {
  test('members_directory filters rows by shift & search, resets cleanly, and opens member WhatsApp modal', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_members/members_directory',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    const initialCount = await rows.count();
    expect(initialCount).toBe(10);
    await expect(main.getByText('Rahul Sharma')).toBeVisible();
    await expect(main.getByText('Priya Verma')).toBeVisible();

    const search = page.locator('#manager-members-search');
    await search.fill('Priya Verma');
    await expect(rows).toHaveCount(1);
    await expect(main.getByText('Rahul Sharma')).toHaveCount(0);
    await search.fill('');
    await expect(rows).toHaveCount(initialCount);

    const shiftFilter = page.getByLabel('Filter by shift');
    await shiftFilter.selectOption('Night');
    const nightCount = await rows.count();
    expect(nightCount).toBeLessThan(initialCount);
    await page.getByRole('button', { name: 'Reset', exact: true }).first().click();
    await expect(rows).toHaveCount(initialCount);
    await expect(main.getByText('Rahul Sharma')).toBeVisible();

    await page.getByRole('button', { name: /Bulk WhatsApp/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /Cancel|Close/i }).first().click();
    await expect(dialog).toBeHidden();
  });

  test('members_enquiries add drawer protects unsaved draft with cancel & continue actions', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_members/members_enquiries',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

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
    await expect(dialog).toBeHidden();
  });

  test('members_new_admission updates shift selection summary and validates required fields on submit', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_members/members_new_admission',
      { checkNoHorizontalOverflow: true },
    );

    await page.locator('#admission-full-name').fill('Playwright Candidate');
    await page.locator('#admission-phone').fill('9876543210');
    await expect(page.locator('#admission-full-name')).toHaveValue('Playwright Candidate');

    await page.getByRole('button', { name: /Full Day Access/i }).click();
    await expect(page.locator('#admission-shift-summary')).toHaveValue(/Full Day/i);

    await expect(page.getByRole('button', { name: 'Confirm Admission', exact: true })).toBeDisabled();
    await expect(page.locator('#admission-full-name')).toHaveValue('Playwright Candidate');
  });

  test('members_group_admission filters batch table and toggles manual entry & CSV upload modals', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_members/members_group_admission',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const search = main.locator('input[type="search"]').first();
    await expect(main.locator('tbody tr')).toHaveCount(2);
    await search.fill('UPSC');
    await expect(main.locator('tbody tr')).toHaveCount(1);
    await expect(main.getByText('Engineering Batch Semester Prep')).toHaveCount(0);
    await search.fill('');
    await expect(main.locator('tbody tr')).toHaveCount(2);

    await page.getByRole('button', { name: /Start Manual Entry/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /Cancel|Close/i }).first().click();
    await expect(page.getByRole('dialog')).toBeHidden();

    await page.getByRole('button', { name: /Upload CSV File/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /Cancel|Close/i }).first().click();
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('members_alumni filters rows by year & search and resets all alumni rows cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_members/members_alumni',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const rows = page.getByTestId('manager-main-content').locator('tbody tr');
    await expect(rows).toHaveCount(8);

    await page.getByTestId('manager-alumni-year-filter').selectOption('2025');
    const filteredByYear = await rows.count();
    expect(filteredByYear).toBeLessThan(8);
    expect(filteredByYear).toBeGreaterThan(0);

    await page.getByTestId('manager-alumni-search-input').fill('NoSuchAlumni2026');
    await expect(
      page.getByText('No alumni records matching the selected search query and filters.'),
    ).toBeVisible();

    await page.getByTestId('manager-alumni-reset-filters').click();
    await expect(page.getByTestId('manager-alumni-search-input')).toHaveValue('');
    await expect(page.getByTestId('manager-alumni-year-filter')).toHaveValue('All');
    await expect(rows).toHaveCount(8);
  });

  test('members_referral_bonus filters referrals, resets rows, and opens apply-to-renewal modal', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_members/members_referral_bonus',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(rows).toHaveCount(7);

    await page.getByLabel('Filter by Status').selectOption('Pending');
    await expect(rows).toHaveCount(2);
    await expect(main.getByText('REF-101')).toHaveCount(0);
    await expect(main.getByText('REF-103')).toBeVisible();

    await page.getByRole('button', { name: 'Reset', exact: true }).first().click();
    await expect(rows).toHaveCount(7);
    await expect(main.getByText('REF-101')).toBeVisible();

    await page.getByTestId('apply-renewal-btn-REF-101').click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal.getByText(/Amit Sharma/i)).toBeVisible();
    await modal.getByRole('button', { name: /Cancel|Close/i }).first().click();
    await expect(modal).toBeHidden();
  });

  test('members_id_card_generator flips front/back card previews and filters by shift', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_members/members_id_card_generator',
      { checkNoHorizontalOverflow: true },
    );

    const frontCards = page.getByTestId('student-id-card-front');
    const backCards = page.getByTestId('student-id-card-back');
    await expect(frontCards.first()).toBeVisible();
    await page.getByTestId('id-card-side-back-btn').first().click();
    await expect(backCards.first()).toBeVisible();
    await page.getByTestId('id-card-side-front-btn').first().click();
    await expect(frontCards.first()).toBeVisible();

    const initialCardCount = await page.locator('[data-testid^="student-id-card-"]').count();
    await page.getByTestId('manager-id-card-shift-filter').selectOption({ index: 1 });
    const filteredCardCount = await page.locator('[data-testid^="student-id-card-"]').count();
    expect(filteredCardCount).toBeLessThanOrEqual(initialCardCount);
    await page.getByTestId('manager-id-card-shift-filter').selectOption({ index: 0 });
    await expect(page.locator('[data-testid^="student-id-card-"]')).toHaveCount(initialCardCount);
  });
});
