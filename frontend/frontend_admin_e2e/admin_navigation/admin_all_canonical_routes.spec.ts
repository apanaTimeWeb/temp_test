import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../frontend_admin/package.json', import.meta.url));
const { expect, test } = require('@playwright/test');

/** Route-level regression sweep for every user-approved Admin leaf; deeper behavior specs remain co-located by capability. */
const canonicalRoutes = [
  {
    "submodule": "dashboard_overview",
    "domain": "admin_dashboard",
    "route": "/admin/admin_dashboard/dashboard_overview"
  },
  {
    "submodule": "dashboard_reports",
    "domain": "admin_dashboard",
    "route": "/admin/admin_dashboard/dashboard_reports"
  },
  {
    "submodule": "members_directory",
    "domain": "admin_members",
    "route": "/admin/admin_members/members_directory"
  },
  {
    "submodule": "members_students",
    "domain": "admin_members",
    "route": "/admin/admin_members/members_students"
  },
  {
    "submodule": "members_enquiries",
    "domain": "admin_members",
    "route": "/admin/admin_members/members_enquiries"
  },
  {
    "submodule": "members_blacklist",
    "domain": "admin_members",
    "route": "/admin/admin_members/members_blacklist"
  },
  {
    "submodule": "members_plans",
    "domain": "admin_members",
    "route": "/admin/admin_members/members_plans"
  },
  {
    "submodule": "members_coupons",
    "domain": "admin_members",
    "route": "/admin/admin_members/members_coupons"
  },
  {
    "submodule": "seats_matrix",
    "domain": "admin_seats_shifts_lockers",
    "route": "/admin/admin_seats_shifts_lockers/seats_matrix"
  },
  {
    "submodule": "seats_management",
    "domain": "admin_seats_shifts_lockers",
    "route": "/admin/admin_seats_shifts_lockers/seats_management"
  },
  {
    "submodule": "seats_history",
    "domain": "admin_seats_shifts_lockers",
    "route": "/admin/admin_seats_shifts_lockers/seats_history"
  },
  {
    "submodule": "seats_maintenance",
    "domain": "admin_seats_shifts_lockers",
    "route": "/admin/admin_seats_shifts_lockers/seats_maintenance"
  },
  {
    "submodule": "shifts_management",
    "domain": "admin_seats_shifts_lockers",
    "route": "/admin/admin_seats_shifts_lockers/shifts_management"
  },
  {
    "submodule": "shifts_migration",
    "domain": "admin_seats_shifts_lockers",
    "route": "/admin/admin_seats_shifts_lockers/shifts_migration"
  },
  {
    "submodule": "shifts_gap",
    "domain": "admin_seats_shifts_lockers",
    "route": "/admin/admin_seats_shifts_lockers/shifts_gap"
  },
  {
    "submodule": "allocations",
    "domain": "admin_seats_shifts_lockers",
    "route": "/admin/admin_seats_shifts_lockers/allocations"
  },
  {
    "submodule": "lockers_management",
    "domain": "admin_seats_shifts_lockers",
    "route": "/admin/admin_seats_shifts_lockers/lockers_management"
  },
  {
    "submodule": "lockers_matrix",
    "domain": "admin_seats_shifts_lockers",
    "route": "/admin/admin_seats_shifts_lockers/lockers_matrix"
  },
  {
    "submodule": "finance_collect_fee",
    "domain": "admin_finance",
    "route": "/admin/admin_finance/finance_collect_fee"
  },
  {
    "submodule": "finance_subscriptions",
    "domain": "admin_finance",
    "route": "/admin/admin_finance/finance_subscriptions"
  },
  {
    "submodule": "finance_renewals",
    "domain": "admin_finance",
    "route": "/admin/admin_finance/finance_renewals"
  },
  {
    "submodule": "finance_payments",
    "domain": "admin_finance",
    "route": "/admin/admin_finance/finance_payments"
  },
  {
    "submodule": "finance_payment_promises",
    "domain": "admin_finance",
    "route": "/admin/admin_finance/finance_payment_promises"
  },
  {
    "submodule": "finance_security_deposits",
    "domain": "admin_finance",
    "route": "/admin/admin_finance/finance_security_deposits"
  },
  {
    "submodule": "finance_late_fees",
    "domain": "admin_finance",
    "route": "/admin/admin_finance/finance_late_fees"
  },
  {
    "submodule": "finance_auto_suspend",
    "domain": "admin_finance",
    "route": "/admin/admin_finance/finance_auto_suspend"
  },
  {
    "submodule": "finance_invoices",
    "domain": "admin_finance",
    "route": "/admin/admin_finance/finance_invoices"
  },
  {
    "submodule": "finance_receipts",
    "domain": "admin_finance",
    "route": "/admin/admin_finance/finance_receipts"
  },
  {
    "submodule": "finance_refunds",
    "domain": "admin_finance",
    "route": "/admin/admin_finance/finance_refunds"
  },
  {
    "submodule": "finance_trust_score",
    "domain": "admin_finance",
    "route": "/admin/admin_finance/finance_trust_score"
  },
  {
    "submodule": "finance_referrals",
    "domain": "admin_finance",
    "route": "/admin/admin_finance/finance_referrals"
  },
  {
    "submodule": "finance_dashboard",
    "domain": "admin_finance",
    "route": "/admin/admin_finance/finance_dashboard"
  },
  {
    "submodule": "accounts_expenses",
    "domain": "admin_accounts_assets",
    "route": "/admin/admin_accounts_assets/accounts_expenses"
  },
  {
    "submodule": "accounts_expense_categories",
    "domain": "admin_accounts_assets",
    "route": "/admin/admin_accounts_assets/accounts_expense_categories"
  },
  {
    "submodule": "accounts_daily_settlement",
    "domain": "admin_accounts_assets",
    "route": "/admin/admin_accounts_assets/accounts_daily_settlement"
  },
  {
    "submodule": "accounts_financial_reports",
    "domain": "admin_accounts_assets",
    "route": "/admin/admin_accounts_assets/accounts_financial_reports"
  },
  {
    "submodule": "accounts_seat_gap_report",
    "domain": "admin_accounts_assets",
    "route": "/admin/admin_accounts_assets/accounts_seat_gap_report"
  },
  {
    "submodule": "accounts_shift_gap_analyzer",
    "domain": "admin_accounts_assets",
    "route": "/admin/admin_accounts_assets/accounts_shift_gap_analyzer"
  },
  {
    "submodule": "assets_register",
    "domain": "admin_accounts_assets",
    "route": "/admin/admin_accounts_assets/assets_register"
  },
  {
    "submodule": "assets_maintenance",
    "domain": "admin_accounts_assets",
    "route": "/admin/admin_accounts_assets/assets_maintenance"
  },
  {
    "submodule": "staff_directory",
    "domain": "admin_staff",
    "route": "/admin/admin_staff/staff_directory"
  },
  {
    "submodule": "staff_roles_permissions",
    "domain": "admin_staff",
    "route": "/admin/admin_staff/staff_roles_permissions"
  },
  {
    "submodule": "system_settings",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_settings"
  },
  {
    "submodule": "system_branding",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_branding"
  },
  {
    "submodule": "system_backups",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_backups"
  },
  {
    "submodule": "system_smart_id",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_smart_id"
  },
  {
    "submodule": "system_bulk_import",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_bulk_import"
  },
  {
    "submodule": "system_data_export",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_data_export"
  },
  {
    "submodule": "system_auto_scale",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_auto_scale"
  },
  {
    "submodule": "system_maintenance",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_maintenance"
  },
  {
    "submodule": "system_offline",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_offline"
  },
  {
    "submodule": "system_power_saving",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_power_saving"
  },
  {
    "submodule": "system_gap_filling",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_gap_filling"
  },
  {
    "submodule": "system_waitlist_automation",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_waitlist_automation"
  },
  {
    "submodule": "system_whatsapp_integration",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_whatsapp_integration"
  },
  {
    "submodule": "system_profile",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_profile"
  },
  {
    "submodule": "system_audit_logs",
    "domain": "admin_system",
    "route": "/admin/admin_system/system_audit_logs"
  },
  {
    "submodule": "communication_notices",
    "domain": "admin_communication",
    "route": "/admin/admin_communication/communication_notices"
  },
  {
    "submodule": "communication_complaints",
    "domain": "admin_communication",
    "route": "/admin/admin_communication/communication_complaints"
  },
  {
    "submodule": "communication_notification_center",
    "domain": "admin_communication",
    "route": "/admin/admin_communication/communication_notification_center"
  },
  {
    "submodule": "communication_whatsapp_templates",
    "domain": "admin_communication",
    "route": "/admin/admin_communication/communication_whatsapp_templates"
  },
  {
    "submodule": "communication_whatsapp_logs",
    "domain": "admin_communication",
    "route": "/admin/admin_communication/communication_whatsapp_logs"
  },
  {
    "submodule": "settings_branches",
    "domain": "admin_settings",
    "route": "/admin/admin_settings/settings_branches"
  },
  {
    "submodule": "settings_security",
    "domain": "admin_settings",
    "route": "/admin/admin_settings/settings_security"
  },
  {
    "submodule": "settings_support",
    "domain": "admin_settings",
    "route": "/admin/admin_settings/settings_support"
  },
  {
    "submodule": "settings_profile",
    "domain": "admin_settings",
    "route": "/admin/admin_settings/settings_profile"
  }
] as const;

for (const item of canonicalRoutes) {
  test(`loads canonical route ${item.route}`, async ({ page }: { page: import('@playwright/test').Page }) => {
    await page.goto(item.route);
    await expect(page).toHaveURL(new RegExp(`${item.route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#]|$)`));
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
  });
}
