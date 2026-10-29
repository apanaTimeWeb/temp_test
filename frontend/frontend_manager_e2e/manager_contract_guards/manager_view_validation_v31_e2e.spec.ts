import { expect, test } from '@playwright/test';

const canonicalLeafRoutes = [
  '/frontend_manager/manager_dashboard/dashboard_overview',
  '/frontend_manager/manager_dashboard/dashboard_reports',
  '/frontend_manager/manager_members/members_directory',
  '/frontend_manager/manager_members/members_new_admission',
  '/frontend_manager/manager_members/members_group_admission',
  '/frontend_manager/manager_members/members_alumni',
  '/frontend_manager/manager_members/members_document_vault',
  '/frontend_manager/manager_members/members_id_card_generator',
  '/frontend_manager/manager_members/members_referral_bonus',
  '/frontend_manager/manager_members/members_enquiries',
  '/frontend_manager/manager_seats_shifts_lockers/seats_matrix',
  '/frontend_manager/manager_seats_shifts_lockers/seats_management',
  '/frontend_manager/manager_seats_shifts_lockers/shifts_management',
  '/frontend_manager/manager_seats_shifts_lockers/shifts_migration',
  '/frontend_manager/manager_seats_shifts_lockers/seats_allocations',
  '/frontend_manager/manager_seats_shifts_lockers/seats_history',
  '/frontend_manager/manager_seats_shifts_lockers/lockers_management',
  '/frontend_manager/manager_seats_shifts_lockers/lockers_matrix',
  '/frontend_manager/manager_finance/finance_collect_fee',
  '/frontend_manager/manager_finance/finance_subscriptions',
  '/frontend_manager/manager_finance/finance_renewals',
  '/frontend_manager/manager_finance/finance_payments',
  '/frontend_manager/manager_finance/finance_payment_promises',
  '/frontend_manager/manager_finance/finance_security_deposits',
  '/frontend_manager/manager_finance/finance_late_fees',
  '/frontend_manager/manager_finance/finance_fines_payments',
  '/frontend_manager/manager_finance/finance_auto_suspend',
  '/frontend_manager/manager_finance/finance_invoices',
  '/frontend_manager/manager_finance/finance_receipts',
  '/frontend_manager/manager_finance/finance_refunds',
  '/frontend_manager/manager_finance/finance_trust_scores',
  '/frontend_manager/manager_finance/finance_referrals',
  '/frontend_manager/manager_accounts_assets/accounts_expenses',
  '/frontend_manager/manager_accounts_assets/accounts_daily_settlement',
  '/frontend_manager/manager_accounts_assets/accounts_seat_gap_report',
  '/frontend_manager/manager_accounts_assets/assets_register',
  '/frontend_manager/manager_accounts_assets/assets_maintenance',
  '/frontend_manager/manager_attendance/attendance_daily',
  '/frontend_manager/manager_attendance/attendance_absentee_report',
  '/frontend_manager/manager_attendance/attendance_qr_scanner',
  '/frontend_manager/manager_attendance/attendance_holiday_calendar',
  '/frontend_manager/manager_communication/communication_notices',
  '/frontend_manager/manager_communication/communication_complaints',
  '/frontend_manager/manager_communication/communication_notification_center',
  '/frontend_manager/manager_communication/communication_whatsapp_templates',
  '/frontend_manager/manager_communication/communication_whatsapp_logs',
  '/frontend_manager/manager_settings/settings_branch_info',
  '/frontend_manager/manager_settings/settings_help_support',
] as const;

test.describe('Manager canonical route map', () => {
  for (const route of canonicalLeafRoutes) {
    test(`canonical leaf route responds without a server error: ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response, `No navigation response for ${route}`).not.toBeNull();
      expect(response!.status(), `Server error for ${route}`).toBeLessThan(500);
    });
  }

  test('domain roots redirect to their frozen canonical default leaf', async ({ page }) => {
    const pairs = [
      ['/frontend_manager/manager_dashboard', '/frontend_manager/manager_dashboard/dashboard_overview'],
      ['/frontend_manager/manager_members', '/frontend_manager/manager_members/members_directory'],
      ['/frontend_manager/manager_seats_shifts_lockers', '/frontend_manager/manager_seats_shifts_lockers/seats_matrix'],
      ['/frontend_manager/manager_finance', '/frontend_manager/manager_finance/finance_collect_fee'],
      ['/frontend_manager/manager_accounts_assets', '/frontend_manager/manager_accounts_assets/accounts_expenses'],
      ['/frontend_manager/manager_attendance', '/frontend_manager/manager_attendance/attendance_daily'],
      ['/frontend_manager/manager_communication', '/frontend_manager/manager_communication/communication_notices'],
      ['/frontend_manager/manager_settings', '/frontend_manager/manager_settings/settings_branch_info'],
    ] as const;
    for (const [source, destination] of pairs) {
      await page.goto(source);
      await expect(page).toHaveURL(new RegExp(`${destination.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`));
    }
  });
});
