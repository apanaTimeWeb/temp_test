import { expect, test } from '@playwright/test';

/** Route-level regression sweep for all 33 canonical Admin leaves across the 8 active domains. */
const canonicalRoutes = [
  { domain: 'admin_dashboard', submodule: 'dashboard_overview', route: '/admin/admin_dashboard/dashboard_overview' },
  { domain: 'admin_dashboard', submodule: 'dashboard_reports', route: '/admin/admin_dashboard/dashboard_reports' },
  { domain: 'admin_members', submodule: 'members_directory', route: '/admin/admin_members/members_directory' },
  { domain: 'admin_members', submodule: 'members_enquiries', route: '/admin/admin_members/members_enquiries' },
  { domain: 'admin_members', submodule: 'members_plans', route: '/admin/admin_members/members_plans' },
  { domain: 'admin_members', submodule: 'members_coupons', route: '/admin/admin_members/members_coupons' },
  { domain: 'admin_members', submodule: 'members_blacklist', route: '/admin/admin_members/members_blacklist' },
  { domain: 'admin_seats_shifts_lockers', submodule: 'seats_matrix', route: '/admin/admin_seats_shifts_lockers/seats_matrix' },
  { domain: 'admin_seats_shifts_lockers', submodule: 'seats_management', route: '/admin/admin_seats_shifts_lockers/seats_management' },
  { domain: 'admin_seats_shifts_lockers', submodule: 'shifts_management', route: '/admin/admin_seats_shifts_lockers/shifts_management' },
  { domain: 'admin_seats_shifts_lockers', submodule: 'shifts_gap', route: '/admin/admin_seats_shifts_lockers/shifts_gap' },
  { domain: 'admin_seats_shifts_lockers', submodule: 'lockers_matrix', route: '/admin/admin_seats_shifts_lockers/lockers_matrix' },
  { domain: 'admin_finance', submodule: 'finance_payments', route: '/admin/admin_finance/finance_payments' },
  { domain: 'admin_finance', submodule: 'finance_refunds', route: '/admin/admin_finance/finance_refunds' },
  { domain: 'admin_finance', submodule: 'finance_referrals', route: '/admin/admin_finance/finance_referrals' },
  { domain: 'admin_finance', submodule: 'finance_auto_suspend', route: '/admin/admin_finance/finance_auto_suspend' },
  { domain: 'admin_finance', submodule: 'finance_security_deposits', route: '/admin/admin_finance/finance_security_deposits' },
  { domain: 'admin_accounts_assets', submodule: 'accounts_daily_settlement', route: '/admin/admin_accounts_assets/accounts_daily_settlement' },
  { domain: 'admin_accounts_assets', submodule: 'accounts_expenses', route: '/admin/admin_accounts_assets/accounts_expenses' },
  { domain: 'admin_accounts_assets', submodule: 'accounts_financial_reports', route: '/admin/admin_accounts_assets/accounts_financial_reports' },
  { domain: 'admin_accounts_assets', submodule: 'accounts_seat_gap_report', route: '/admin/admin_accounts_assets/accounts_seat_gap_report' },
  { domain: 'admin_accounts_assets', submodule: 'assets_register', route: '/admin/admin_accounts_assets/assets_register' },
  { domain: 'admin_communication', submodule: 'communication_notices', route: '/admin/admin_communication/communication_notices' },
  { domain: 'admin_communication', submodule: 'communication_complaints', route: '/admin/admin_communication/communication_complaints' },
  { domain: 'admin_communication', submodule: 'communication_notification_center', route: '/admin/admin_communication/communication_notification_center' },
  { domain: 'admin_communication', submodule: 'communication_whatsapp_templates', route: '/admin/admin_communication/communication_whatsapp_templates' },
  { domain: 'admin_communication', submodule: 'communication_whatsapp_logs', route: '/admin/admin_communication/communication_whatsapp_logs' },
  { domain: 'admin_staff', submodule: 'staff_directory', route: '/admin/admin_staff/staff_directory' },
  { domain: 'admin_staff', submodule: 'staff_attendance', route: '/admin/admin_staff/staff_attendance' },
  { domain: 'admin_staff', submodule: 'staff_payroll', route: '/admin/admin_staff/staff_payroll' },
  { domain: 'admin_settings', submodule: 'settings_profile', route: '/admin/admin_settings/settings_profile' },
  { domain: 'admin_settings', submodule: 'settings_branches', route: '/admin/admin_settings/settings_branches' },
  { domain: 'admin_settings', submodule: 'settings_security', route: '/admin/admin_settings/settings_security' },
  { domain: 'admin_settings', submodule: 'settings_support', route: '/admin/admin_settings/settings_support' },
] as const;

for (const item of canonicalRoutes) {
  test(`loads canonical route ${item.route}`, async ({ page }) => {
    await page.goto(item.route);
    await expect(page).toHaveURL(new RegExp(`${item.route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#]|$)`));
    await expect(page.getByRole('heading').first()).toBeVisible();
    await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
  });
}
