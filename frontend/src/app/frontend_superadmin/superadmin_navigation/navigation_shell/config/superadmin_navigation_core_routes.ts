// RESPONSIBILITY: Core verified route literals for modules 01 through 08.

export const SUPERADMIN_NAVIGATION_CORE_ROUTES = {
  // 01 Dashboard Overview
  superadmin_dashboard: '/superadmin/superadmin_dashboard/dashboard_overview',
  dashboard_overview: '/superadmin/superadmin_dashboard/dashboard_overview',

  // 02 Library Account Management
  superadmin_libraries: '/superadmin/superadmin_libraries/libraries_overview',
  libraries_overview: '/superadmin/superadmin_libraries/libraries_overview',
  libraries_onboarding_setup: '/superadmin/superadmin_libraries/libraries_onboarding_setup',
  libraries_profile_configuration: '/superadmin/superadmin_libraries/libraries_profile_configuration',
  libraries_student_bulk_import: '/superadmin/superadmin_libraries/libraries_overview',
  libraries_student_smart_id: '/superadmin/superadmin_libraries/libraries_overview',

  // 03 Branch Management
  superadmin_branches: '/superadmin/superadmin_branches/branches_overview',
  branches_overview: '/superadmin/superadmin_branches/branches_overview',

  // 04 Admin & User Management
  superadmin_users: '/superadmin/superadmin_users/users_directory',
  users_overview: '/superadmin/superadmin_users/users_directory',
  users_directory: '/superadmin/superadmin_users/users_directory',
  users_roles_permissions: '/superadmin/superadmin_users/users_roles_permissions',
  users_member_referrals: '/superadmin/superadmin_users/users_directory',
  users_member_trust_score: '/superadmin/superadmin_users/users_directory',

  // 05 Plans & Subscription
  superadmin_plans: '/superadmin/superadmin_plans/plans_pricing_catalog',
  plans_pricing_catalog: '/superadmin/superadmin_plans/plans_pricing_catalog',
  plans_promotions: '/superadmin/superadmin_plans/plans_promotions',
  superadmin_subscriptions: '/superadmin/superadmin_subscriptions/subscriptions_overview',
  subscriptions_overview: '/superadmin/superadmin_subscriptions/subscriptions_overview',
  subscriptions_active_subscribers: '/superadmin/superadmin_subscriptions/subscriptions_active_subscribers',

  // 06 Billing & Payments
  superadmin_billing: '/superadmin/superadmin_billing/billing_invoices',
  billing_overview: '/superadmin/superadmin_billing/billing_invoices',
  billing_invoices: '/superadmin/superadmin_billing/billing_invoices',

  // 07 Feature & Module Control
  superadmin_features: '/superadmin/superadmin_features/features_overview',
  features_overview: '/superadmin/superadmin_features/features_overview',

  // 08 Usage & Limit Monitoring
  superadmin_usage: '/superadmin/superadmin_usage/usage_overview',
  usage_overview: '/superadmin/superadmin_usage/usage_overview',
  usage_quota_requests: '/superadmin/superadmin_usage/usage_quota_requests',
} as const;
