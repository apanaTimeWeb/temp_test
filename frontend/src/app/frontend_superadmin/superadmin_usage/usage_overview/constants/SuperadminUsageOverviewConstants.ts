// constants/SuperadminUsageOverviewConstants.ts

export const USAGE_SEVERITY_LEVELS = {
  NORMAL: 'NORMAL',
  WARNING_80: 'WARNING_80',
  CRITICAL_90: 'CRITICAL_90',
  EXCEEDED_100: 'EXCEEDED_100',
} as const;

export const OVERAGE_POLICIES = {
  HARD_STOP: {
    label: 'Hard Block on Limit',
    description: 'Creation disabled upon reaching cap. Zero silent extra billing.',
    badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40',
  },
  UPGRADE_REQUIRED: {
    label: 'Upgrade Required',
    description: 'Current plan maxed. Must upgrade tier to unlock more capacity.',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  ADDON_ACTIVE: {
    label: 'Addon Allocation',
    description: 'Supplemental branch/quota granted via SuperAdmin approval.',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  },
} as const;

export const USAGE_CATEGORY_TABS = [
  { id: 'all', label: 'All 12 Resources' },
  { id: 'branches', label: 'Branches & Users' },
  { id: 'storage', label: 'Storage & Files' },
  { id: 'communication', label: 'SMS, WhatsApp & Email' },
  { id: 'system', label: 'APIs, Exports & Backups' },
] as const;

export const USAGE_TABLE_COLUMNS = [
  { id: 'library', label: 'Library Account' },
  { id: 'plan', label: 'Plan Tier' },
  { id: 'branches', label: 'Branches (Cur / Max)' },
  { id: 'users', label: 'Admins & Staff' },
  { id: 'members', label: 'Members' },
  { id: 'storage', label: 'Storage & Files' },
  { id: 'communication', label: 'SMS & WhatsApp' },
  { id: 'system', label: 'API & Backups' },
  { id: 'overage', label: 'Overage Policy' },
  { id: 'actions', label: 'Actions' },
] as const;
