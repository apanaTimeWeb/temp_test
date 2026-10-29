import { expect, test } from '@playwright/test';

const destinations = [
  { label: "Dashboard", href: "/frontend_manager/manager_dashboard/dashboard_overview" },
  { label: "Reports", href: "/frontend_manager/manager_dashboard/dashboard_reports" },
  { label: "Enquiries", href: "/frontend_manager/manager_members/members_enquiries" },
  { label: "Member Directory", href: "/frontend_manager/manager_members/members_directory" },
  { label: "New Admission", href: "/frontend_manager/manager_members/members_new_admission" },
  { label: "Group Admission", href: "/frontend_manager/manager_members/members_group_admission" },
  { label: "Alumni", href: "/frontend_manager/manager_members/members_alumni" },
  { label: "Document Vault", href: "/frontend_manager/manager_members/members_document_vault" },
  { label: "Referral Bonus", href: "/frontend_manager/manager_members/members_referral_bonus" },
  { label: "ID Card Generator", href: "/frontend_manager/manager_members/members_id_card_generator" },
  { label: "Seat Matrix", href: "/frontend_manager/manager_seats_shifts_lockers/seats_matrix" },
  { label: "Seats", href: "/frontend_manager/manager_seats_shifts_lockers/seats_management" },
  { label: "Shifts", href: "/frontend_manager/manager_seats_shifts_lockers/shifts_management" },
  { label: "Shift Migration", href: "/frontend_manager/manager_seats_shifts_lockers/shifts_migration" },
  { label: "Allocations", href: "/frontend_manager/manager_seats_shifts_lockers/seats_allocations" },
  { label: "Seat History", href: "/frontend_manager/manager_seats_shifts_lockers/seats_history" },
  { label: "Lockers", href: "/frontend_manager/manager_seats_shifts_lockers/lockers_management" },
  { label: "Locker Matrix", href: "/frontend_manager/manager_seats_shifts_lockers/lockers_matrix" },
  { label: "Collect Fee", href: "/frontend_manager/manager_finance/finance_collect_fee" },
  { label: "Subscriptions", href: "/frontend_manager/manager_finance/finance_subscriptions" },
  { label: "Renewals", href: "/frontend_manager/manager_finance/finance_renewals" },
  { label: "Payments", href: "/frontend_manager/manager_finance/finance_payments" },
  { label: "Payment Promises", href: "/frontend_manager/manager_finance/finance_payment_promises" },
  { label: "Trust Scores", href: "/frontend_manager/manager_finance/finance_trust_scores" },
  { label: "Security Deposits", href: "/frontend_manager/manager_finance/finance_security_deposits" },
  { label: "Late Fees", href: "/frontend_manager/manager_finance/finance_late_fees" },
  { label: "Fines & Payments", href: "/frontend_manager/manager_finance/finance_fines_payments" },
  { label: "Auto-Suspend", href: "/frontend_manager/manager_finance/finance_auto_suspend" },
  { label: "Invoice", href: "/frontend_manager/manager_finance/finance_invoices" },
  { label: "Receipt", href: "/frontend_manager/manager_finance/finance_receipts" },
  { label: "Referrals", href: "/frontend_manager/manager_finance/finance_referrals" },
  { label: "Refunds", href: "/frontend_manager/manager_finance/finance_refunds" },
  { label: "Attendance", href: "/frontend_manager/manager_attendance/attendance_daily" },
  { label: "Absentee Report", href: "/frontend_manager/manager_attendance/attendance_absentee_report" },
  { label: "QR Scanner", href: "/frontend_manager/manager_attendance/attendance_qr_scanner" },
  { label: "Holiday Calendar", href: "/frontend_manager/manager_attendance/attendance_holiday_calendar" },
  { label: "Expenses", href: "/frontend_manager/manager_accounts_assets/accounts_expenses" },
  { label: "Daily Settlement", href: "/frontend_manager/manager_accounts_assets/accounts_daily_settlement" },
  { label: "Seat Gap Report", href: "/frontend_manager/manager_accounts_assets/accounts_seat_gap_report" },
  { label: "Assets", href: "/frontend_manager/manager_accounts_assets/assets_register" },
  { label: "Asset Maintenance", href: "/frontend_manager/manager_accounts_assets/assets_maintenance" },
  { label: "Notices", href: "/frontend_manager/manager_communication/communication_notices" },
  { label: "Complaints", href: "/frontend_manager/manager_communication/communication_complaints" },
  { label: "Notification Center", href: "/frontend_manager/manager_communication/communication_notification_center" },
  { label: "WhatsApp Logs", href: "/frontend_manager/manager_communication/communication_whatsapp_logs" },
  { label: "WhatsApp Templates", href: "/frontend_manager/manager_communication/communication_whatsapp_templates" },
  { label: "Help & Support", href: "/frontend_manager/manager_settings/settings_help_support" },
  { label: "Branch Info", href: "/frontend_manager/manager_settings/settings_branch_info" }
] as const;

test.describe('Manager V36 sidebar destination contract', () => {
  test('renders all 48 screenshot destinations exactly once', async ({ page }) => {
    await page.goto('/frontend_manager/manager_dashboard/dashboard_overview');
    const links = page.locator('[data-testid="manager-navigation"] a[data-testid^="manager-nav-link-"]');
    await expect(links).toHaveCount(48);
    for (const destination of destinations) {
      await expect(page.getByRole('link', { name: destination.label, exact: true })).toHaveAttribute('href', destination.href);
    }
  });

  test('every canonical destination route responds without a framework 404', async ({ page }) => {
    for (const destination of destinations) {
      const response = await page.goto(destination.href);
      expect(response, `${destination.label} should produce a document response`).not.toBeNull();
      expect(response!.status(), `${destination.label} should not return HTTP 404`).not.toBe(404);
    }
  });
});
