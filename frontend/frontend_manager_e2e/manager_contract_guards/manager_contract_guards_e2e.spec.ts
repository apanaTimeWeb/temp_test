import { expect, test } from '@playwright/test';

test.describe('Manager durable-write contract guardrails — cross-module regression', () => {
  test('invoice detail preserves the requested list ID without attributing sample invoice data to it', async ({ page }) => {
    await page.goto('/frontend_manager/manager_finance/finance_invoices?view=invoice');
    const viewLink = page.getByRole('link', { name: 'View', exact: true }).first();
    const href = await viewLink.getAttribute('href');
    expect(href, 'Invoice URL must come from the visible source-list link').not.toBeNull();
    const requestedInvoiceId = new URL(href!, 'http://localhost').searchParams.get('id');
    expect(requestedInvoiceId, 'Invoice ID must be carried as the canonical query parameter').not.toBeNull();
    await viewLink.click();
    await expect(page.getByRole('heading', { name: 'Invoice Details Unavailable' })).toBeVisible();
    await expect(page.getByTestId('manager-finance-invoice-detail-contract-warning')).toBeVisible();
    await expect(page.getByTestId('manager-finance-requested-invoice-id')).toHaveText(requestedInvoiceId!);
    await expect(page.getByText('INV-20260411-001', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Print unavailable', exact: true })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Share unavailable', exact: true })).toBeDisabled();
  });

  test('receipt detail preserves the requested list ID without presenting sample data as proof of payment', async ({ page }) => {
    await page.goto('/frontend_manager/manager_finance/finance_receipts?view=receipt');
    const viewLink = page.getByRole('link', { name: 'View', exact: true }).first();
    const href = await viewLink.getAttribute('href');
    expect(href, 'Receipt URL must come from the visible source-list link').not.toBeNull();
    const requestedReceiptId = new URL(href!, 'http://localhost').searchParams.get('id');
    expect(requestedReceiptId, 'Receipt ID must be carried as the canonical query parameter').not.toBeNull();
    await viewLink.click();
    await expect(page.getByRole('heading', { name: 'Receipt Details Unavailable' })).toBeVisible();
    await expect(page.getByTestId('manager-finance-receipt-detail-contract-warning')).toBeVisible();
    await expect(page.getByTestId('manager-finance-requested-receipt-id')).toHaveText(requestedReceiptId!);
    await expect(page.getByText('SAMPLE RECEIPT — NOT PROOF OF PAYMENT', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Print unavailable', exact: true })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Share unavailable', exact: true })).toBeDisabled();
  });

  test('document vault does not simulate upload, download, or delete', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_members/members_document_vault');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.getByTestId('manager-documents-contract-warning')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Upload unavailable' })).toBeDisabled();
    for (const button of await page.getByRole('button', { name: /Download unavailable/ }).all()) {
      await expect(button).toBeDisabled();
    }
    for (const button of await page.getByRole('button', { name: /Delete unavailable/ }).all()) {
      await expect(button).toBeDisabled();
    }
  });

  test('sample invoices and receipts cannot be printed or shared as authoritative financial documents', async ({ page }) => {
    await page.goto('/frontend_manager/manager_finance/finance_invoices?view=invoice');
    await expect(page.getByTestId('manager-finance-invoice-contract-warning')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Print unavailable', exact: true }).first()).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Share unavailable', exact: true }).first()).toBeDisabled();

    await page.goto('/frontend_manager/manager_finance/finance_receipts?view=receipt');
    await expect(page.getByTestId('manager-finance-receipt-contract-warning')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Print unavailable', exact: true }).first()).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Share unavailable', exact: true }).first()).toBeDisabled();
  });

  test('attendance is preview-only and cannot claim it was saved or alert parents', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_attendance/attendance_daily?view=attendance');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.getByTestId('manager-engagement-attendance-contract-warning')).toBeVisible();
    await expect(page.getByTestId('manager-engagement-attendance-save-disabled')).toBeDisabled();
    await expect(page.getByLabel('Sample date; date filtering unavailable')).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Alert unavailable' }).first()).toBeDisabled();
    await expect(page.getByText(/local preview/i)).toBeVisible();
  });

  test('QR scanner does not fabricate a scan result without camera decoding or student lookup', async ({ page }) => {
    await page.goto('/frontend_manager/manager_attendance/attendance_qr_scanner?view=qr_scanner');
    await expect(page.getByTestId('manager-engagement-attendance-contract-warning')).toBeVisible();
    await expect(page.getByTestId('manager-engagement-qr-camera-unavailable')).toBeVisible();
    await expect(page.getByTestId('manager-engagement-qr-start-disabled')).toBeDisabled();
    await expect(page.getByText('QR Code Detected!', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Rahul Sharma', { exact: true })).toHaveCount(0);
  });

  test('branch information save remains disabled without the verified mutation contract', async ({ page }) => {
    await page.goto('/frontend_manager/manager_settings/settings_branch_info');
    await expect(page.getByTestId('manager-branch-info-sample-data-warning')).toBeVisible();
    await expect(page.getByTestId('manager-branch-info-save-contract-warning')).toBeVisible();
    await expect(page.getByRole('button', { name: /Save unavailable/ })).toBeDisabled();
  });

  test('support-ticket submission is disabled and does not claim local creation', async ({ page }) => {
    await page.goto('/frontend_manager/manager_settings/settings_help_support');
    await expect(page.getByTestId('manager-support-ticket-contract-warning')).toBeVisible();
    await page.getByRole('button', { name: 'Raise a Ticket', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Raise a Support Ticket' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit unavailable', exact: true })).toBeDisabled();
  });

  test('notices and complaint write actions remain disabled with read-only host APIs', async ({ page }) => {
    await page.goto('/frontend_manager/manager_communication/communication_notices?view=notices');
    await expect(page.getByTestId('manager-communication-notices-contract-warning')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Post Notice unavailable', exact: true }).first()).toBeDisabled();
    for (const action of await page.getByRole('button', { name: /unavailable$/i }).all()) {
      await expect(action).toBeDisabled();
    }

    await page.goto('/frontend_manager/manager_communication/communication_complaints?view=complaints');
    await expect(page.getByTestId('manager-communication-complaints-contract-warning')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Complaint unavailable', exact: true })).toBeDisabled();
    for (const action of await page.getByRole('button', { name: /unavailable$/i }).all()) {
      await expect(action).toBeDisabled();
    }
  });

  test('accounting reports disclose sample values and avoid implying unsupported reporting periods or exports', async ({ page }) => {
    await page.goto('/frontend_manager/manager_dashboard/dashboard_reports?view=financial_reports');
    await expect(page.getByTestId('manager-accounting-financial-reports-sample-warning')).toBeVisible();
    await expect(page.getByText('Monthly sample', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Quarterly', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Yearly', exact: true })).toHaveCount(0);

    await page.goto('/frontend_manager/manager_accounts_assets/accounts_seat_gap_report?view=seat_gap_report');
    await expect(page.getByTestId('manager-accounting-seat-gap-sample-warning')).toBeVisible();
    await expect(page.getByTestId('manager-accounting-seat-gap-export-disabled')).toBeDisabled();

    await page.goto('/frontend_manager/manager_seats_shifts_lockers/shifts_management?view=shift_gap');
    await expect(page.getByTestId('manager-accounting-shift-gap-sample-warning')).toBeVisible();
  });

  test('sample subscription renewals cannot be exported or printed as official business records', async ({ page }) => {
    await page.goto('/frontend_manager/manager_finance/finance_renewals?view=renewals');
    await expect(page.getByText(/Renewal records are sample data/i)).toBeVisible();
    await expect(page.getByTestId('manager-finance-renewals-export-disabled')).toBeDisabled();
    await expect(page.getByTestId('manager-finance-renewals-print-disabled')).toBeDisabled();
  });

  test('accounting asset and maintenance lists do not simulate durable changes', async ({ page }) => {
    await page.goto('/frontend_manager/manager_accounts_assets/assets_register?view=assets');
    await expect(page.getByTestId('manager-accounting-assets-contract-warning')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Asset unavailable', exact: true })).toBeDisabled();

    await page.goto('/frontend_manager/manager_accounts_assets/assets_maintenance?view=asset_maintenance');
    await expect(page.getByTestId('manager-accounting-maintenance-contract-warning')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log Request unavailable', exact: true })).toBeDisabled();
    for (const action of await page.getByRole('button', { name: 'Update unavailable', exact: true }).all()) {
      await expect(action).toBeDisabled();
    }
  });

  test('holiday changes remain blocked while calendar navigation stays available', async ({ page }) => {
    await page.goto('/frontend_manager/manager_attendance/attendance_holiday_calendar?view=holiday_calendar');
    await expect(page.getByTestId('manager-engagement-holiday-contract-warning')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Holiday unavailable', exact: true })).toBeDisabled();
    for (const action of await page.getByRole('button', { name: 'Delete unavailable', exact: true }).all()) {
      await expect(action).toBeDisabled();
    }
  });

  test('seat, shift, and locker commit controls are disabled until host contracts exist', async ({ page }) => {
    await page.goto('/frontend_manager/manager_seats_shifts_lockers/seats_management?view=seat_management');
    await expect(page.getByTestId('manager-seats-contract-warning')).toBeVisible();
    await page.getByRole('button', { name: 'Add Seat', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Save unavailable', exact: true })).toBeDisabled();

    await page.goto('/frontend_manager/manager_seats_shifts_lockers/shifts_management?view=shift_management');
    await expect(page.getByTestId('manager-seats-contract-warning')).toBeVisible();
    await page.getByRole('button', { name: 'Add Shift', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Save unavailable', exact: true })).toBeDisabled();

    await page.goto('/frontend_manager/manager_seats_shifts_lockers/lockers_management?view=lockers');
    await expect(page.getByTestId('manager-seats-contract-warning')).toBeVisible();
    await page.getByRole('button', { name: 'Add Locker', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Add unavailable', exact: true })).toBeDisabled();
  });

  test('seat maintenance and shift migration cannot commit local-only records', async ({ page }) => {
    await page.goto('/frontend_manager/manager_seats_shifts_lockers/seats_management?view=seat_maintenance');
    await expect(page.getByTestId('manager-seats-maintenance-contract-warning')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Log Entry unavailable', exact: true })).toBeDisabled();

    await page.goto('/frontend_manager/manager_seats_shifts_lockers/shifts_migration?view=shift_migration');
    await expect(page.getByTestId('manager-shift-migration-contract-warning')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Migration unavailable', exact: true })).toBeDisabled();
  });
});

test('seat matrix date filter and sample shift quick-fill do not imply unsupported filtering or assignment', async ({ page }) => {
  await page.route('**/seats_shifts_lockers/seat-matrix', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 'seat-fixture-1', seatNumber: 'S-1', isActive: true, isOccupied: false, isExpiring: false, studentName: null, shift: 'Morning', expiryDate: null }]),
    });
  });

  await page.goto('/frontend_manager/manager_seats_shifts_lockers/seats_matrix');
  await expect(page.getByText('Date filter unavailable', { exact: true })).toBeVisible();
  await expect(page.getByText(/Date-based filtering is disabled until an authoritative date-aware seat-matrix API contract is supplied/i)).toBeVisible();

  await page.goto('/frontend_manager/manager_seats_shifts_lockers/shifts_management?view=shift_gap');
  await expect(page.getByTestId('manager-shift-gap-sample-warning')).toBeVisible();
  await expect(page.getByLabel('Period filter unavailable')).toBeDisabled();
  const quickFillActions = page.getByRole('button', { name: 'Quick Fill unavailable', exact: true });
  await expect(quickFillActions).toHaveCount(3);
  for (const action of await quickFillActions.all()) {
    await expect(action).toBeDisabled();
  }
});

test('CRM enquiry creation is local-only and cannot issue a POST without the host contract', async ({ page }) => {
  let postCount = 0;
  await page.route('**/crm/enquiries', async (route) => {
    if (route.request().method() === 'POST') {
      postCount += 1;
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 'unexpected' }) });
      return;
    }
    await route.continue();
  });

  await page.goto('/frontend_manager/manager_members/members_enquiries?view=add');
  await expect(page.getByTestId('manager-crm-create-contract-warning')).toBeVisible();
  await expect(page.locator('form button[type="submit"]')).toBeDisabled();
  expect(postCount).toBe(0);
});

test('group admission does not claim empty records or enable unsupported import/create actions', async ({ page }) => {
  await page.goto('/frontend_manager/manager_members/members_group_admission?view=group');
  await expect(page.getByTestId('manager-students-group-admission-contract-warning')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Upload unavailable', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Manual entry unavailable', exact: true })).toBeDisabled();
  await expect(page.getByText(/Group admission records are unavailable/i)).toBeVisible();
});

test('admission preview exposes only local draft fields while creation remains unavailable', async ({ page }) => {
  await page.goto('/frontend_manager/manager_members/members_new_admission?view=new');
  await expect(page.getByTestId('manager-students-admission-contract-warning')).toBeVisible();
  await expect(page.locator('form button[type="submit"]')).toBeDisabled();
  await expect(page.getByLabel('Full Name')).toBeVisible();
  await expect(page.getByLabel('Phone Number')).toBeVisible();
  for (const selector of ['#admission-parent-phone', '#admission-email', '#admission-college', '#admission-transaction', '#admission-remark']) {
    await expect(page.locator(selector)).toHaveCount(0);
  }
});

test('student admission stays local-only and cannot issue a POST or claim creation without the host contract', async ({ page }) => {
  let postCount = 0;
  await page.route('**/students', async (route) => {
    if (route.request().method() === 'POST') {
      postCount += 1;
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 'unexpected', smartId: 'LIB-777' }) });
      return;
    }
    await route.continue();
  });

  await page.goto('/frontend_manager/manager_members/members_new_admission?view=new');
  await expect(page.getByTestId('manager-students-admission-contract-warning')).toBeVisible();
  await page.getByLabel('Full Name').fill('Contract Test Student');
  await page.getByLabel('Phone Number').fill('9000000088');
  await expect(page.locator('form button[type="submit"]')).toBeDisabled();
  await page.getByLabel('Phone Number').press('Enter');
  await expect(page.getByRole('heading', { name: 'Student Record Created' })).toHaveCount(0);
  await expect(page.getByTestId('manager-students-admission-success')).toHaveCount(0);
  expect(postCount).toBe(0);
});

