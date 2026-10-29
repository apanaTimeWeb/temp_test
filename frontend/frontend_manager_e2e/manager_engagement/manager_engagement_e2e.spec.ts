import { expect, test } from '@playwright/test';

test.describe('Manager engagement — outbound and attendance side-effect guardrails', () => {
  test('parent alerts are disabled without a messaging integration contract', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_attendance/attendance_absentee_report?view=absentee_report');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.getByTestId('manager-engagement-absentee-contract-warning')).toBeVisible();
    await expect(page.getByRole('button', { name: /Bulk alerts unavailable/ })).toBeDisabled();
    for (const action of await page.getByRole('button', { name: /Alert unavailable/ }).all()) {
      await expect(action).toBeDisabled();
    }
  });

  test('QR scan stays a preview and cannot write attendance without the host contract', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_attendance/attendance_qr_scanner?view=qr_scanner');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.getByTestId('manager-engagement-attendance-contract-warning')).toBeVisible();
    await page.getByRole('button', { name: /Start Scanning/ }).click();
    await page.getByText('Tap to simulate scan').click();
    await expect(page.getByText('QR Code Detected!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mark IN unavailable' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Mark OUT unavailable' })).toBeDisabled();
  });
});
