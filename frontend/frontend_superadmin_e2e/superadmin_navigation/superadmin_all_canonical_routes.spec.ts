import { expect, test } from '@playwright/test';

/**
 * Route-level regression sweep for every active canonical Superadmin leaf.
 * Verifies that all canonical pages render cleanly with status 200, valid URL, visible content, and zero 404/crashes.
 */
const canonicalSuperadminRoutes = [
  // 01 Dashboard Overview
  { domain: 'superadmin_dashboard', submodule: 'dashboard_overview', route: '/superadmin/superadmin_dashboard/dashboard_overview' },

  // 02 Library Management
  { domain: 'superadmin_libraries', submodule: 'libraries_overview', route: '/superadmin/superadmin_libraries/libraries_overview' },
  { domain: 'superadmin_libraries', submodule: 'libraries_onboarding_setup', route: '/superadmin/superadmin_libraries/libraries_onboarding_setup' },
  { domain: 'superadmin_libraries', submodule: 'libraries_profile_configuration', route: '/superadmin/superadmin_libraries/libraries_profile_configuration' },

  // 03 Branches
  { domain: 'superadmin_branches', submodule: 'branches_overview', route: '/superadmin/superadmin_branches/branches_overview' },

  // 04 Users & Roles
  { domain: 'superadmin_users', submodule: 'users_directory', route: '/superadmin/superadmin_users/users_directory' },
  { domain: 'superadmin_users', submodule: 'users_roles_permissions', route: '/superadmin/superadmin_users/users_roles_permissions' },

  // 05 Plans & Subscriptions
  { domain: 'superadmin_plans', submodule: 'plans_pricing_catalog', route: '/superadmin/superadmin_plans/plans_pricing_catalog' },
  { domain: 'superadmin_plans', submodule: 'plans_promotions', route: '/superadmin/superadmin_plans/plans_promotions' },
  { domain: 'superadmin_subscriptions', submodule: 'subscriptions_overview', route: '/superadmin/superadmin_subscriptions/subscriptions_overview' },
  { domain: 'superadmin_subscriptions', submodule: 'subscriptions_active_subscribers', route: '/superadmin/superadmin_subscriptions/subscriptions_active_subscribers' },

  // 06 Billing & Payments
  { domain: 'superadmin_billing', submodule: 'billing_invoices', route: '/superadmin/superadmin_billing/billing_invoices' },

  // 07 Features Control
  { domain: 'superadmin_features', submodule: 'features_overview', route: '/superadmin/superadmin_features/features_overview' },

  // 08 Usage & Quotas
  { domain: 'superadmin_usage', submodule: 'usage_overview', route: '/superadmin/superadmin_usage/usage_overview' },
  { domain: 'superadmin_usage', submodule: 'usage_quota_requests', route: '/superadmin/superadmin_usage/usage_quota_requests' },

  // 09 Security & Audit Logs
  { domain: 'superadmin_security', submodule: 'security_overview', route: '/superadmin/superadmin_security/security_overview' },
  { domain: 'superadmin_security', submodule: 'security_threats', route: '/superadmin/superadmin_security/security_threats' },
  { domain: 'superadmin_security', submodule: 'security_active_sessions', route: '/superadmin/superadmin_security/security_active_sessions' },
  { domain: 'superadmin_security', submodule: 'security_ip_firewall', route: '/superadmin/superadmin_security/security_ip_firewall' },
  { domain: 'superadmin_security', submodule: 'security_login_security', route: '/superadmin/superadmin_security/security_login_security' },
  { domain: 'superadmin_security', submodule: 'security_mfa', route: '/superadmin/superadmin_security/security_mfa' },
  { domain: 'superadmin_security', submodule: 'security_password_policy', route: '/superadmin/superadmin_security/security_password_policy' },
  { domain: 'superadmin_security', submodule: 'security_audit_logs', route: '/superadmin/superadmin_security/security_audit_logs' },

  // 10 Analytics & Reports
  { domain: 'superadmin_analytics', submodule: 'analytics_platform_reports', route: '/superadmin/superadmin_analytics/analytics_platform_reports' },
  { domain: 'superadmin_analytics', submodule: 'analytics_billing_reports', route: '/superadmin/superadmin_analytics/analytics_billing_reports' },
  { domain: 'superadmin_analytics', submodule: 'analytics_usage_reports', route: '/superadmin/superadmin_analytics/analytics_usage_reports' },
  { domain: 'superadmin_analytics', submodule: 'analytics_security_reports', route: '/superadmin/superadmin_analytics/analytics_security_reports' },
  { domain: 'superadmin_analytics', submodule: 'analytics_library_growth', route: '/superadmin/superadmin_analytics/analytics_library_growth' },
  { domain: 'superadmin_analytics', submodule: 'analytics_subscription_mix', route: '/superadmin/superadmin_analytics/analytics_subscription_mix' },

  // 11 Support & Tickets
  { domain: 'superadmin_support', submodule: 'support_tickets', route: '/superadmin/superadmin_support/support_tickets' },

  // 12 Communication & Notices
  { domain: 'superadmin_communication', submodule: 'communication_notification_center', route: '/superadmin/superadmin_communication/communication_notification_center' },
  { domain: 'superadmin_communication', submodule: 'communication_notices', route: '/superadmin/superadmin_communication/communication_notices' },

  // 13 Integrations
  { domain: 'superadmin_integrations', submodule: 'integrations_overview', route: '/superadmin/superadmin_integrations/integrations_overview' },

  // 14 Data & Backups
  { domain: 'superadmin_data', submodule: 'data_overview', route: '/superadmin/superadmin_data/data_overview' },
  { domain: 'superadmin_data', submodule: 'data_backup_operations', route: '/superadmin/superadmin_data/data_backup_operations' },
  { domain: 'superadmin_data', submodule: 'data_restore_operations', route: '/superadmin/superadmin_data/data_restore_operations' },
  { domain: 'superadmin_data', submodule: 'data_export_management', route: '/superadmin/superadmin_data/data_export_management' },
  { domain: 'superadmin_data', submodule: 'data_import_migration', route: '/superadmin/superadmin_data/data_import_migration' },
  { domain: 'superadmin_data', submodule: 'data_archive_retention', route: '/superadmin/superadmin_data/data_archive_retention' },

  // 15 System Health & Audit
  { domain: 'superadmin_system', submodule: 'system_health_overview', route: '/superadmin/superadmin_system/system_health_overview' },
  { domain: 'superadmin_system', submodule: 'system_audit_logs', route: '/superadmin/superadmin_system/system_audit_logs' },

  // 16 Settings & Configuration
  { domain: 'superadmin_settings', submodule: 'settings_general', route: '/superadmin/superadmin_settings/settings_general' },
  { domain: 'superadmin_settings', submodule: 'settings_branding', route: '/superadmin/superadmin_settings/settings_branding' },
  { domain: 'superadmin_settings', submodule: 'settings_library_configuration', route: '/superadmin/superadmin_settings/settings_library_configuration' },
] as const;

for (const item of canonicalSuperadminRoutes) {
  test(`loads canonical superadmin route ${item.route}`, async ({ page }) => {
    const response = await page.goto(item.route, { waitUntil: 'domcontentloaded' });
    if (response) {
      expect(response.status()).toBeLessThan(400);
    }
    await expect(page).toHaveURL(new RegExp(`${item.route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#]|$)`));
    await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
    await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
    await expect(page.getByText('Application error', { exact: false })).toHaveCount(0);
  });
}

// Sweep verified legacy aliases to ensure redirect contracts hold
const legacyAliasRoutes = [
  { source: '/superadmin/superadmin_billing/billing_overview', target: '/superadmin/superadmin_billing/billing_invoices' },
  { source: '/superadmin/superadmin_analytics/analytics_financials', target: '/superadmin/superadmin_analytics/analytics_billing_reports' },
  { source: '/superadmin/superadmin_analytics/analytics_overview', target: '/superadmin/superadmin_analytics/analytics_platform_reports' },
  { source: '/superadmin/superadmin_support/support_complaints', target: '/superadmin/superadmin_support/support_tickets' },
] as const;

for (const alias of legacyAliasRoutes) {
  test(`legacy alias ${alias.source} redirects to canonical ${alias.target}`, async ({ page }) => {
    await page.goto(alias.source, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`${alias.target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#]|$)`));
    await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  });
}
