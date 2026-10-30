import { expect, test } from '@playwright/test';
test('loads the canonical allocations submodule route', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers/allocations');
  await expect(page).toHaveURL(new RegExp('\\/admin\\/admin_seats_shifts_lockers\\/allocations(?:[?#]|$)'));
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('demo allocations import, export and print controls have real local behavior', async ({ page }) => {
  test.skip(process.env.PLAYWRIGHT_APP_MODE !== 'demo', 'Requires PLAYWRIGHT_APP_MODE=demo and a server built with NEXT_PUBLIC_FRONTEND_DEMO_MODE=true.');
  await page.addInitScript(() => { window.print = () => { document.documentElement.dataset.printCalled = 'true'; }; });
  await page.goto('/admin/admin_seats_shifts_lockers/allocations');
  await expect(page.getByRole('heading', { name: /allocations/i })).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('admin_allocations-page-control-009').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^admin-allocations-\d{4}-\d{2}-\d{2}\.csv$/);

  await page.locator('input[type="file"]').setInputFiles({
    name: 'allocation-import.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('studentName,smartId,phone,seatNo,shift,customSlots,lockerNo,feeStatus,validFrom,validTill,daysLeft,status\nNew Test Student,LIB-NEW,9876543210,S-90,Morning,,A-90,Paid,01 Jan 2026,31 Dec 2026,60,Active'),
  });
  await expect(page.getByText('New Test Student')).toBeVisible();

  await page.getByTestId('admin_allocations-page-control-010').click();
  await expect(page.locator('html')).toHaveAttribute('data-print-called', 'true');
});


test('allocation filters persist in the URL and preserve unrelated query state', async ({ page }) => {
  await page.goto('/admin/admin_seats_shifts_lockers/allocations?source=control-test');
  await page.getByRole('combobox', { name: 'Shift' }).selectOption('Morning');
  await expect(page).toHaveURL(/shift=Morning/);
  await expect(page).toHaveURL(/source=control-test/);
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Shift' })).toHaveValue('Morning');
});
