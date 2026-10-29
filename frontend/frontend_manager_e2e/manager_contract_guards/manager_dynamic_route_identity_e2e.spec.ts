import { expect, test } from '@playwright/test';

test.describe('Manager dynamic route identity contract checks — authored, not executed in this checkpoint', () => {
  test('CRM enquiry detail uses the ID in the route when requesting and rendering the record', async ({ page }) => {
    let requestedUrl = '';
    await page.route('**/crm/enquiries/enq_001', async (route) => {
      requestedUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'enq_001',
          name: 'Aarav Sharma',
          phone: '9876500022',
          shift: 'Morning',
          status: 'New',
          source: 'Google Ads',
          handledBy: 'Sarah Jenkins',
          addedDate: '24 May',
          enquiryDate: 'May 24, 2025',
          preferredBranch: 'Downtown Hub',
          avatar: 'AS',
          followUps: [],
          isOverdue: true,
        }),
      });
    });

    await page.goto('/frontend_manager/manager_members/members_enquiries?view=detail&id=enq_001');
    await expect(page.getByRole('heading', { name: 'Aarav Sharma' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Ishani Gupta' })).toHaveCount(0);
    expect(new URL(requestedUrl).pathname).toMatch(/\/crm\/enquiries\/enq_001$/);
  });

  test('student detail route ID is passed to the feature API and matches the rendered student', async ({ page }) => {
    let requestedUrl = '';
    await page.route('**/students/2', async (route) => {
      requestedUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '2',
          smartId: 'LIB-002',
          name: 'Priya Sharma',
          phone: '+91 98765 43211',
          status: 'Active',
          shift: 'Evening',
          seat: 'S-11',
          branch: 'Main Branch',
          plan: 'Quarterly',
          dueMinor: 150000,
          currency: 'INR',
          joined: '15/02/2024',
        }),
      });
    });

    await page.goto('/frontend_manager/manager_members/members_directory?view=profile&id=2');
    await expect(page.getByText('Priya Sharma', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('LIB-002', { exact: true })).toBeVisible();
    await expect(page.getByText('Alex Rivera', { exact: true })).toHaveCount(0);
    expect(new URL(requestedUrl).pathname).toMatch(/\/students\/2$/);
  });

  test('student edit fallback preserves the originating route ID and does not offer a fake save', async ({ page }) => {
    await page.goto('/frontend_manager/manager_members/members_directory?view=edit&id=2');
    await expect(page.getByText('Student edit contract is not supplied', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to student profile', exact: true })).toHaveAttribute('href', '/frontend_manager/manager_members/members_directory?view=profile&id=2');
    await expect(page.getByRole('button', { name: /save/i })).toHaveCount(0);
  });

  test('ID card remains a preview only when the student API has no authoritative expiry or verification contract', async ({ page }) => {
    await page.route('**/students', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: '1',
          smartId: 'LIB-001',
          name: 'Alex Rivera',
          phone: '+91 98765 43210',
          status: 'Active',
          shift: 'Morning',
          seat: 'S-01',
          branch: 'Main Branch',
          plan: 'Monthly',
          dueMinor: 0,
          currency: 'INR',
          joined: '01/01/2024',
        }]),
      });
    });

    await page.goto('/frontend_manager/manager_members/members_id_card_generator?view=id_card&id=LIB-001');
    await expect(page.getByTestId('manager-students-id-card-output-contract-warning')).toBeVisible();
    await expect(page.getByTestId('manager-students-id-card-print-disabled')).toBeDisabled();
    await expect(page.getByTestId('manager-students-id-card-message-disabled')).toBeDisabled();
    await expect(page.getByText('Expiry date not provided by the student API contract', { exact: true })).toBeVisible();
    await expect(page.getByText('Use the actions to print or send the generated card.', { exact: true })).toHaveCount(0);
  });

  test('student directory honors the smartId query parameter passed by seat allocation', async ({ page }) => {
    await page.route('**/students', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'student-demo-1', smartId: 'LIB-001', name: 'Alex Rivera', phone: '+91 98765 43210', status: 'Active', shift: 'Morning', seat: 'S-01', branch: 'Main Branch', plan: 'Monthly', dueMinor: 0, currency: 'INR', joined: '01/01/2024' },
          { id: 'student-demo-2', smartId: 'LIB-002', name: 'Priya Sharma', phone: '+91 98765 43211', status: 'Active', shift: 'Evening', seat: 'S-11', branch: 'Main Branch', plan: 'Quarterly', dueMinor: 150000, currency: 'INR', joined: '15/02/2024' },
        ]),
      });
    });

    await page.goto('/frontend_manager/manager_members/members_directory?smartId=LIB-002');
    await expect(page.locator('#manager-students-search')).toHaveValue('LIB-002');
    await expect(page.getByText('Priya Sharma', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Alex Rivera', { exact: true })).toHaveCount(0);
  });

  test('student directory consumes the seat query emitted by the dashboard matrix and can clear it', async ({ page }) => {
    await page.route('**/students', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'student-demo-1', smartId: 'LIB-001', name: 'Alex Rivera', phone: '+91 98765 43210', status: 'Active', shift: 'Morning', seat: 'S-01', branch: 'Main Branch', plan: 'Monthly', dueMinor: 0, currency: 'INR', joined: '01/01/2024' },
          { id: 'student-demo-2', smartId: 'LIB-002', name: 'Priya Sharma', phone: '+91 98765 43211', status: 'Active', shift: 'Evening', seat: 'S-11', branch: 'Main Branch', plan: 'Quarterly', dueMinor: 150000, currency: 'INR', joined: '15/02/2024' },
        ]),
      });
    });

    await page.goto('/frontend_manager/manager_members/members_directory?seat=01');
    await expect(page.getByTestId('manager-students-seat-filter')).toContainText('01');
    await expect(page.getByText('Alex Rivera', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Priya Sharma', { exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Clear filter', exact: true }).click();
    await expect(page).not.toHaveURL(/seat=01/);
    await expect(page.getByText('Priya Sharma', { exact: true }).first()).toBeVisible();
  });

  test('ID-card student selection updates the URL to the selected Smart ID', async ({ page }) => {
    await page.route('**/students', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', smartId: 'LIB-001', name: 'Alex Rivera', phone: '+91 98765 43210', status: 'Active', shift: 'Morning', seat: 'S-01', branch: 'Main Branch', plan: 'Monthly', dueMinor: 0, currency: 'INR', joined: '01/01/2024' },
          { id: '2', smartId: 'LIB-002', name: 'Priya Sharma', phone: '+91 98765 43211', status: 'Active', shift: 'Evening', seat: 'S-11', branch: 'Main Branch', plan: 'Quarterly', dueMinor: 150000, currency: 'INR', joined: '15/02/2024' },
        ]),
      });
    });

    await page.goto('/frontend_manager/manager_members/members_id_card_generator?view=id_card&id=LIB-001');
    await expect(page.getByText('Alex Rivera', { exact: true }).first()).toBeVisible();
    await page.getByRole('button', { name: /Priya Sharma/ }).click();
    await expect(page).toHaveURL(/id=LIB-002/);
    await expect(page.getByText('Priya Sharma', { exact: true }).first()).toBeVisible();
  });

  test('late-fee sample rows cannot open a fake fee preview or send a reminder', async ({ page }) => {
    await page.goto('/frontend_manager/manager_finance/finance_late_fees?view=late_fees');
    const previewActions = page.getByTestId('manager-finance-late-fee-sample-preview-disabled');
    await expect(previewActions).toHaveCount(3);
    for (let index = 0; index < await previewActions.count(); index += 1) {
      await expect(previewActions.nth(index)).toBeDisabled();
    }
    const reminderActions = page.getByTestId('manager-finance-late-fee-sample-reminder-disabled');
    await expect(reminderActions).toHaveCount(3);
    for (let index = 0; index < await reminderActions.count(); index += 1) {
      await expect(reminderActions.nth(index)).toBeDisabled();
    }
    await expect(page.getByText('Rahul Kumar', { exact: true })).toBeVisible();
    await expect(page.getByText(/sample data/i).first()).toBeVisible();
  });

});
