import { expect, test } from '@playwright/test';

test('notification sending and fake delivery history are disabled without the verified messaging contract', async ({ page }) => {
  const response = await page.goto('/frontend_manager/manager_communication/communication_notification_center?view=notification_center');
  expect(response).not.toBeNull();
  expect(response!.status()).toBeLessThan(400);
  await expect(page.getByTestId('manager-communication-send-contract-warning')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'My System Notifications', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Member Notifications', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'My System Notifications', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Sending unavailable' })).toBeDisabled();
  await page.getByRole('button', { name: 'Overdue Reminders', exact: true }).click();
  await expect(page.getByRole('button', { name: /Send All Pending unavailable/ })).toBeDisabled();
  await expect(page.getByText('Overdue reminder data is unavailable', { exact: true })).toBeVisible();
  await expect(page.getByText('No pending overdue reminders', { exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'Reservation Alerts', exact: true }).click();
  await expect(page.getByText('Reservation alert data is unavailable', { exact: true })).toBeVisible();
  await expect(page.getByText(/Reservation confirmed for student ID/i)).toHaveCount(0);

  await page.getByRole('button', { name: 'Membership Alerts', exact: true }).click();
  await expect(page.getByText('Membership expiry data is unavailable', { exact: true })).toBeVisible();
  await expect(page.getByText(/12 memberships expiring/i)).toHaveCount(0);

  await page.getByRole('button', { name: 'Announcements', exact: true }).click();
  await expect(page.getByText('Announcement data is unavailable', { exact: true })).toBeVisible();
  await expect(page.getByText(/Holiday Closure: Diwali/i)).toHaveCount(0);
  await expect(page.getByText('Views: 342', { exact: true })).toHaveCount(0);
});
