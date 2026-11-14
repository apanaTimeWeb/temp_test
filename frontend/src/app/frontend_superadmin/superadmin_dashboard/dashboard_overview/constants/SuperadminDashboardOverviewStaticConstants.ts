// RESPONSIBILITY: Define stable module-owned constants for dashboard overview; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_dashboard/dashboard_overview/constants/SuperadminDashboardOverviewStaticConstants.ts -> typed constants -> component/hook/config behavior.
import { AlertTriangle, CreditCard, Headphones, CloudUpload, CircleHelp, Landmark, Users, IndianRupee, Clock3 } from 'lucide-react';



/** Static module-owned options/status mapping extracted from SuperadminDashboardOverviewRecentLibrariesTable.tsx. */
export const SUPERADMIN_DASHBOARD_RECENT_LIBRARIES_TABLE_PLAN_CLS = {
  Basic:      'sa-badge--info',
  Starter:    'sa-badge--info',
  Pro:        'sa-badge--primary',
  Enterprise: 'sa-badge',
};

/** Static module-owned options/status mapping extracted from SuperadminDashboardOverviewActionItemsPanel.tsx. */
export const SUPERADMIN_DASHBOARD_ACTION_ITEMS_PANEL_ICON_MAP = {
  warning:         AlertTriangle,
  credit_card_off: CreditCard,
  support_agent:   Headphones,
  cloud_upload:    CloudUpload,
  '⚠️': AlertTriangle,
  '🔴': AlertTriangle,
  '🔵': CircleHelp,
};


/** Static module-owned options/status mapping extracted from SuperadminDashboardOverviewKpiCard.tsx. */
export const SUPERADMIN_DASHBOARD_KPI_CARD_ICON_MAP = {
  store: Landmark,
  groups: Users,
  currency_rupee: IndianRupee,
  pending_actions: Clock3,
};
