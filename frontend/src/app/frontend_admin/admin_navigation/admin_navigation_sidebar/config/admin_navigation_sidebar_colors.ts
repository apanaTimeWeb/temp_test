export interface AdminNavColorMeta {
  iconColor: string;
  bg: string;
}

export const ADMIN_NAV_GROUP_COLORS: Record<string, AdminNavColorMeta> = {
  dashboard: { iconColor: '#38bdf8', bg: 'rgba(56, 189, 248, 0.14)' },            // Sky Blue
  members: { iconColor: '#34d399', bg: 'rgba(52, 211, 153, 0.14)' },              // Mint Emerald
  seats_shifts_lockers: { iconColor: '#22d3ee', bg: 'rgba(34, 211, 238, 0.14)' }, // Cyan
  finance: { iconColor: '#10b981', bg: 'rgba(16, 185, 129, 0.14)' },              // Emerald Green
  accounts_assets: { iconColor: '#60a5fa', bg: 'rgba(96, 165, 250, 0.14)' },      // Blue
  communication: { iconColor: '#f59e0b', bg: 'rgba(245, 158, 11, 0.14)' },        // Amber
  staff: { iconColor: '#818cf8', bg: 'rgba(129, 140, 248, 0.14)' },               // Indigo
  settings: { iconColor: '#a78bfa', bg: 'rgba(167, 139, 250, 0.14)' },            // Violet
};

export const ADMIN_NAV_SUBMODULE_COLORS: Record<string, AdminNavColorMeta> = {
  // Dashboard
  SUBMODULE_DASHBOARD_OVERVIEW: { iconColor: '#38bdf8', bg: 'rgba(56, 189, 248, 0.14)' },
  SUBMODULE_DASHBOARD_REPORTS: { iconColor: '#a78bfa', bg: 'rgba(167, 139, 250, 0.14)' },

  // Members
  SUBMODULE_MEMBERS_DIRECTORY: { iconColor: '#34d399', bg: 'rgba(52, 211, 153, 0.14)' },
  SUBMODULE_MEMBERS_ENQUIRIES: { iconColor: '#fb923c', bg: 'rgba(251, 146, 60, 0.14)' },
  SUBMODULE_MEMBERS_PLANS: { iconColor: '#facc15', bg: 'rgba(250, 204, 21, 0.14)' },
  SUBMODULE_MEMBERS_COUPONS: { iconColor: '#ec4899', bg: 'rgba(236, 72, 153, 0.14)' },
  SUBMODULE_MEMBERS_BLACKLIST: { iconColor: '#f43f5e', bg: 'rgba(244, 63, 94, 0.14)' },

  // Seats, Shifts & Lockers
  SUBMODULE_SEATS_MATRIX: { iconColor: '#22d3ee', bg: 'rgba(34, 211, 238, 0.14)' },
  SUBMODULE_SEATS_MANAGEMENT: { iconColor: '#38bdf8', bg: 'rgba(56, 189, 248, 0.14)' },
  SUBMODULE_SHIFTS_MANAGEMENT: { iconColor: '#c084fc', bg: 'rgba(192, 132, 252, 0.14)' },
  SUBMODULE_SHIFTS_GAP: { iconColor: '#fbbf24', bg: 'rgba(251, 191, 36, 0.14)' },
  SUBMODULE_LOCKERS_MATRIX: { iconColor: '#f472b6', bg: 'rgba(244, 114, 182, 0.14)' },

  // Finance
  SUBMODULE_FINANCE_PAYMENTS: { iconColor: '#4ade80', bg: 'rgba(74, 222, 128, 0.14)' },
  SUBMODULE_FINANCE_REFUNDS: { iconColor: '#fb7185', bg: 'rgba(251, 113, 133, 0.14)' },
  SUBMODULE_FINANCE_REFERRALS: { iconColor: '#facc15', bg: 'rgba(250, 204, 21, 0.14)' },

  // Accounts & Assets
  SUBMODULE_ACCOUNTS_DAILY_SETTLEMENT: { iconColor: '#34d399', bg: 'rgba(52, 211, 153, 0.14)' },
  SUBMODULE_ACCOUNTS_EXPENSES: { iconColor: '#f87171', bg: 'rgba(248, 113, 113, 0.14)' },
  SUBMODULE_ACCOUNTS_FINANCIAL_REPORTS: { iconColor: '#a855f7', bg: 'rgba(168, 85, 247, 0.14)' },
  SUBMODULE_ACCOUNTS_SEAT_GAP_REPORT: { iconColor: '#c084fc', bg: 'rgba(192, 132, 252, 0.14)' },
  SUBMODULE_ASSETS_REGISTER: { iconColor: '#60a5fa', bg: 'rgba(96, 165, 250, 0.14)' },

  // Communication
  SUBMODULE_COMMUNICATION_NOTICES: { iconColor: '#fbbf24', bg: 'rgba(251, 191, 36, 0.14)' },
  SUBMODULE_COMMUNICATION_COMPLAINTS: { iconColor: '#f43f5e', bg: 'rgba(244, 63, 94, 0.14)' },
  SUBMODULE_COMMUNICATION_NOTIFICATION_CENTER: { iconColor: '#facc15', bg: 'rgba(250, 204, 21, 0.14)' },
  SUBMODULE_COMMUNICATION_WHATSAPP_TEMPLATES: { iconColor: '#25d366', bg: 'rgba(37, 211, 102, 0.14)' },
  SUBMODULE_COMMUNICATION_WHATSAPP_LOGS: { iconColor: '#22c55e', bg: 'rgba(34, 197, 94, 0.14)' },

  // Staff
  SUBMODULE_STAFF_DIRECTORY: { iconColor: '#818cf8', bg: 'rgba(129, 140, 248, 0.14)' },
  SUBMODULE_STAFF_ATTENDANCE: { iconColor: '#4ade80', bg: 'rgba(74, 222, 128, 0.14)' },
  SUBMODULE_STAFF_PAYROLL: { iconColor: '#facc15', bg: 'rgba(250, 204, 21, 0.14)' },

  // Settings
  SUBMODULE_SETTINGS_PROFILE: { iconColor: '#34d399', bg: 'rgba(52, 211, 153, 0.14)' },
  SUBMODULE_SETTINGS_SECURITY: { iconColor: '#10b981', bg: 'rgba(16, 185, 129, 0.14)' },
  SUBMODULE_SETTINGS_SUPPORT: { iconColor: '#38bdf8', bg: 'rgba(56, 189, 248, 0.14)' },
};

export const DEFAULT_ADMIN_NAV_COLOR: AdminNavColorMeta = {
  iconColor: '#818cf8',
  bg: 'rgba(129, 140, 248, 0.14)',
};
