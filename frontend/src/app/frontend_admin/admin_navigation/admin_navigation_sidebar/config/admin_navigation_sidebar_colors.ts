export interface AdminNavColorMeta {
  badgeClass: string;
}

export const ADMIN_NAV_GROUP_COLORS: Record<string, AdminNavColorMeta> = {
  dashboard: { badgeClass: 'admin-nav-tint-sky' },
  members: { badgeClass: 'admin-nav-tint-mint' },
  seats_shifts_lockers: { badgeClass: 'admin-nav-tint-cyan' },
  finance: { badgeClass: 'admin-nav-tint-emerald' },
  accounts_assets: { badgeClass: 'admin-nav-tint-blue' },
  communication: { badgeClass: 'admin-nav-tint-amber' },
  staff: { badgeClass: 'admin-nav-tint-indigo' },
  settings: { badgeClass: 'admin-nav-tint-violet' },
};

export const ADMIN_NAV_SUBMODULE_COLORS: Record<string, AdminNavColorMeta> = {
  // Dashboard
  SUBMODULE_DASHBOARD_OVERVIEW: { badgeClass: 'admin-nav-tint-sky' },
  SUBMODULE_DASHBOARD_REPORTS: { badgeClass: 'admin-nav-tint-violet' },

  // Members
  SUBMODULE_MEMBERS_DIRECTORY: { badgeClass: 'admin-nav-tint-mint' },
  SUBMODULE_MEMBERS_ENQUIRIES: { badgeClass: 'admin-nav-tint-orange' },
  SUBMODULE_MEMBERS_PLANS: { badgeClass: 'admin-nav-tint-yellow' },
  SUBMODULE_MEMBERS_COUPONS: { badgeClass: 'admin-nav-tint-pink' },
  SUBMODULE_MEMBERS_BLACKLIST: { badgeClass: 'admin-nav-tint-rose' },

  // Seats, Shifts & Lockers
  SUBMODULE_SEATS_MATRIX: { badgeClass: 'admin-nav-tint-cyan' },
  SUBMODULE_SEATS_MANAGEMENT: { badgeClass: 'admin-nav-tint-sky' },
  SUBMODULE_SHIFTS_MANAGEMENT: { badgeClass: 'admin-nav-tint-purple' },
  SUBMODULE_SHIFTS_GAP: { badgeClass: 'admin-nav-tint-gold' },
  SUBMODULE_LOCKERS_MATRIX: { badgeClass: 'admin-nav-tint-fuchsia' },

  // Finance
  SUBMODULE_FINANCE_PAYMENTS: { badgeClass: 'admin-nav-tint-green' },
  SUBMODULE_FINANCE_SECURITY_DEPOSITS: { badgeClass: 'admin-nav-tint-gold' },
  SUBMODULE_FINANCE_AUTO_SUSPEND: { badgeClass: 'admin-nav-tint-amber' },
  SUBMODULE_FINANCE_REFUNDS: { badgeClass: 'admin-nav-tint-coral' },
  SUBMODULE_FINANCE_REFERRALS: { badgeClass: 'admin-nav-tint-yellow' },

  // Accounts & Assets
  SUBMODULE_ACCOUNTS_DAILY_SETTLEMENT: { badgeClass: 'admin-nav-tint-mint' },
  SUBMODULE_ACCOUNTS_EXPENSES: { badgeClass: 'admin-nav-tint-red' },
  SUBMODULE_ACCOUNTS_FINANCIAL_REPORTS: { badgeClass: 'admin-nav-tint-orchid' },
  SUBMODULE_ACCOUNTS_SEAT_GAP_REPORT: { badgeClass: 'admin-nav-tint-purple' },
  SUBMODULE_ASSETS_REGISTER: { badgeClass: 'admin-nav-tint-blue' },

  // Communication
  SUBMODULE_COMMUNICATION_NOTICES: { badgeClass: 'admin-nav-tint-gold' },
  SUBMODULE_COMMUNICATION_COMPLAINTS: { badgeClass: 'admin-nav-tint-rose' },
  SUBMODULE_COMMUNICATION_NOTIFICATION_CENTER: { badgeClass: 'admin-nav-tint-yellow' },
  SUBMODULE_COMMUNICATION_WHATSAPP_TEMPLATES: { badgeClass: 'admin-nav-tint-whatsapp' },
  SUBMODULE_COMMUNICATION_WHATSAPP_LOGS: { badgeClass: 'admin-nav-tint-leaf' },

  // Staff
  SUBMODULE_STAFF_DIRECTORY: { badgeClass: 'admin-nav-tint-indigo' },
  SUBMODULE_STAFF_ATTENDANCE: { badgeClass: 'admin-nav-tint-green' },
  SUBMODULE_STAFF_PAYROLL: { badgeClass: 'admin-nav-tint-yellow' },

  // Settings
  SUBMODULE_SETTINGS_PROFILE: { badgeClass: 'admin-nav-tint-mint' },
  SUBMODULE_SETTINGS_BRANCHES: { badgeClass: 'admin-nav-tint-blue' },
  SUBMODULE_SETTINGS_SECURITY: { badgeClass: 'admin-nav-tint-emerald' },
  SUBMODULE_SETTINGS_SUPPORT: { badgeClass: 'admin-nav-tint-sky' },
};

export const DEFAULT_ADMIN_NAV_COLOR: AdminNavColorMeta = {
  badgeClass: 'admin-nav-tint-indigo',
};
