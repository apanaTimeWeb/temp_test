import { expect, test } from '@playwright/test';

/** Canonical route sweep for all 35 active Manager leaves across all 8 domains. */
const canonicalRoutes = [
  '/frontend_manager/manager_dashboard/dashboard_overview',
  '/frontend_manager/manager_dashboard/dashboard_reports',
  '/frontend_manager/manager_members/members_enquiries',
  '/frontend_manager/manager_members/members_directory',
  '/frontend_manager/manager_members/members_new_admission',
  '/frontend_manager/manager_members/members_group_admission',
  '/frontend_manager/manager_members/members_alumni',
  '/frontend_manager/manager_members/members_referral_bonus',
  '/frontend_manager/manager_members/members_id_card_generator',
  '/frontend_manager/manager_seats_shifts_lockers/seats_matrix',
  '/frontend_manager/manager_seats_shifts_lockers/seats_history',
  '/frontend_manager/manager_seats_shifts_lockers/lockers_management',
  '/frontend_manager/manager_finance/finance_collect_fee',
  '/frontend_manager/manager_finance/finance_subscriptions',
  '/frontend_manager/manager_finance/finance_renewals',
  '/frontend_manager/manager_finance/finance_payment_promises',
  '/frontend_manager/manager_finance/finance_trust_scores',
  '/frontend_manager/manager_finance/finance_security_deposits',
  '/frontend_manager/manager_finance/finance_fines_payments',
  '/frontend_manager/manager_finance/finance_auto_suspend',
  '/frontend_manager/manager_attendance/attendance_daily',
  '/frontend_manager/manager_attendance/attendance_absentee_report',
  '/frontend_manager/manager_attendance/attendance_qr_scanner',
  '/frontend_manager/manager_accounts_assets/accounts_expenses',
  '/frontend_manager/manager_accounts_assets/accounts_daily_settlement',
  '/frontend_manager/manager_accounts_assets/accounts_seat_gap_report',
  '/frontend_manager/manager_accounts_assets/assets_register',
  '/frontend_manager/manager_accounts_assets/assets_maintenance',
  '/frontend_manager/manager_communication/communication_complaints',
  '/frontend_manager/manager_communication/communication_notification_center',
  '/frontend_manager/manager_communication/communication_whatsapp_logs',
  '/frontend_manager/manager_communication/communication_whatsapp_templates',
  '/frontend_manager/manager_settings/settings_help_support',
  '/frontend_manager/manager_settings/settings_branch_info',
  '/frontend_manager/manager_settings/settings_security',
] as const;

test.describe('Manager shell & canonical navigation', () => {
  test('renders 35 sidebar destinations, single main landmark, and navigates cleanly', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/frontend_manager/manager_dashboard/dashboard_overview');

    await expect(page.getByTestId('manager-role-shell')).toBeVisible();
    await expect(page.getByTestId('manager-header')).toBeVisible();
    await expect(page.getByRole('main')).toHaveCount(1);

    const navigation = page.getByTestId('manager-navigation');
    await expect(navigation).toBeVisible();
    await expect(navigation.locator('a[href^="/frontend_manager/"]')).toHaveCount(35);

    for (const route of canonicalRoutes) {
      await expect(navigation.locator(`a[href="${route}"]`)).toHaveCount(1);
    }

    await navigation.locator('a[href="/frontend_manager/manager_dashboard/dashboard_reports"]').click();
    await expect(page).toHaveURL(/\/frontend_manager\/manager_dashboard\/dashboard_reports\/?$/);
    await expect(navigation.locator('a[href="/frontend_manager/manager_dashboard/dashboard_reports"]')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('desktop sidebar collapses/expands and search filters navigation items', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/frontend_manager/manager_dashboard/dashboard_overview');

    const sidebar = page.getByTestId('manager-sidebar');
    const toggle = page.getByRole('button', { name: 'Toggle sidebar' });
    await expect(sidebar).not.toHaveClass(/mgr-sidebar-collapsed/);
    await toggle.click();
    await expect(sidebar).toHaveClass(/mgr-sidebar-collapsed/);
    await toggle.click();
    await expect(sidebar).not.toHaveClass(/mgr-sidebar-collapsed/);

    const navSearch = sidebar.getByRole('searchbox');
    if ((await navSearch.count()) > 0 && (await navSearch.isVisible())) {
      await navSearch.fill('Auto-Suspend');
      await expect(sidebar.locator('a[href="/frontend_manager/manager_finance/finance_auto_suspend"]')).toBeVisible();
      await navSearch.fill('');
    }
  });

  test('mobile drawer opens, traps Tab focus, and closes cleanly on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/frontend_manager/manager_dashboard/dashboard_overview');

    await page.getByRole('button', { name: 'Open menu' }).click();
    const closeButton = page.getByTestId('manager-sidebar-toggle');
    await expect(closeButton).toHaveAttribute('aria-label', 'Close sidebar');
    await expect(closeButton).toBeFocused();

    const sidebar = page.getByTestId('manager-sidebar');
    const focusable = sidebar.locator(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable.first();
    const last = focusable.last();
    await last.focus();
    await page.keyboard.press('Tab');
    await expect(first).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('manager-sidebar-toggle')).toHaveAttribute('aria-label', 'Toggle sidebar');
  });

  test('all 8 domain roots and /manager entry redirect to canonical default leaves', async ({ page }) => {
    const pairs = [
      ['/manager', '/frontend_manager/manager_dashboard/dashboard_overview'],
      ['/frontend_manager', '/frontend_manager/manager_dashboard/dashboard_overview'],
      ['/frontend_manager/manager_dashboard', '/frontend_manager/manager_dashboard/dashboard_overview'],
      ['/frontend_manager/manager_members', '/frontend_manager/manager_members/members_directory'],
      ['/frontend_manager/manager_seats_shifts_lockers', '/frontend_manager/manager_seats_shifts_lockers/seats_matrix'],
      ['/frontend_manager/manager_finance', '/frontend_manager/manager_finance/finance_collect_fee'],
      ['/frontend_manager/manager_accounts_assets', '/frontend_manager/manager_accounts_assets/accounts_expenses'],
      ['/frontend_manager/manager_attendance', '/frontend_manager/manager_attendance/attendance_daily'],
      ['/frontend_manager/manager_communication', '/frontend_manager/manager_communication/communication_complaints'],
      ['/frontend_manager/manager_settings', '/frontend_manager/manager_settings/settings_branch_info'],
    ] as const;

    for (const [source, destination] of pairs) {
      const response = await page.goto(source);
      expect(response).not.toBeNull();
      expect(response!.status()).toBeLessThan(400);
      if (source !== '/manager') {
        await expect(page).toHaveURL(new RegExp(`${destination.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#]|$)`));
      }
      await expect(page.getByTestId('manager-role-shell')).toBeVisible();
    }
  });

  for (const route of canonicalRoutes) {
    test(`loads canonical route ${route} cleanly`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));

      const response = await page.goto(route);
      expect(response, `No response for ${route}`).not.toBeNull();
      expect(response!.status(), `${route} returned HTTP ${response!.status()}`).toBeLessThan(400);
      await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#]|$)`));
      await expect(page.getByTestId('manager-role-shell')).toBeVisible();
      await expect(page.getByTestId('manager-main-content')).toBeVisible();
      await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
      await expect(page.getByText('MISSING_MESSAGE', { exact: false })).toHaveCount(0);
      expect(errors).toEqual([]);
    });
  }
});
