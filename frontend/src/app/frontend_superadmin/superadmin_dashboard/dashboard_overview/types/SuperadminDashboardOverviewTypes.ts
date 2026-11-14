// FLOW: Feature source -> superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Dashboard Types; defines module-owned type contracts for the named data boundary. */
export interface SuperadminDashboardOverviewKpiCard {
  title: string;
  titleKey?: string;
  value: string;
  valueMinor?: number;
  currencyCode?: string;
  icon: string;
  subtitle?: string;
  subtitleKey?: string;
  subtitleAmountMinor?: number;
  subtitleCurrencyCode?: string;
  trend?: string;
  progress?: number;
  alert?: string;
  alertKey?: string;
}

/**
 * Defines the public SuperadminDashboardSystemHealth contract for dashboard overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property uptime Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property activeUsers Value defined by the existing feature-local contract. Declared type: number.
 * @property apiLatency Value defined by the existing feature-local contract. Declared type: string.
 * @property lastBackup Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminDashboardSystemHealth {
  uptime: string;
  activeUsers: number;
  apiLatency: string;
  lastBackup: string;
}

/**
 * Defines the public SuperadminDashboardActionItem contract for dashboard overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property title Display label for the owning feature. Declared type: string.
 * @property titleKey Display label for the owning feature. Declared type: string.
 * @property description Value defined by the existing feature-local contract. Declared type: string.
 * @property descriptionKey Value defined by the existing feature-local contract. Declared type: string.
 * @property type Value defined by the existing feature-local contract. Declared type: 'warning' | 'error' | 'info'.
 * @property icon Value defined by the existing feature-local contract. Declared type: string.
 * @property actionLabel Display label for the owning feature. Declared type: string.
 * @property actionLabelKey Display label for the owning feature. Declared type: string.
 * @property actionUrl Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminDashboardActionItem {
  id: string;
  title: string;
  titleKey?: string;
  description: string;
  descriptionKey?: string;
  type: 'warning' | 'error' | 'info';
  icon: string;
  actionLabel: string;
  actionLabelKey?: string;
  actionUrl: string;
}

/**
 * Defines the public SuperadminDashboardRecentLibrary contract for dashboard overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property initials Value defined by the existing feature-local contract. Declared type: string.
 * @property name Display label for the owning feature. Declared type: string.
 * @property owner Value defined by the existing feature-local contract. Declared type: string.
 * @property students Value defined by the existing feature-local contract. Declared type: number.
 * @property status Status value as represented by the existing feature contract. Declared type: 'active' | 'setup' | 'inactive'.
 * @property plan Value defined by the existing feature-local contract. Declared type: string.
 * @property joinedAt Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminDashboardRecentLibrary {
  initials: string;
  name: string;
  owner: string;
  students: number;
  status: 'active' | 'setup' | 'inactive';
  plan: string;
  joinedAt: string;
}

/**
 * Defines the public SuperadminDashboardDataResponse contract for dashboard overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property kpiCards Value defined by the existing feature-local contract. Declared type: SuperadminDashboardOverviewKpiCard[].
 * @property systemHealth Value defined by the existing feature-local contract. Declared type: SuperadminDashboardSystemHealth.
 * @property actionItems Value defined by the existing feature-local contract. Declared type: SuperadminDashboardActionItem[].
 * @property recentLibraries Value defined by the existing feature-local contract. Declared type: SuperadminDashboardRecentLibrary[].
 */
export interface SuperadminDashboardDataResponse {
  kpiCards: SuperadminDashboardOverviewKpiCard[];
  systemHealth: SuperadminDashboardSystemHealth;
  actionItems: SuperadminDashboardActionItem[];
  recentLibraries: SuperadminDashboardRecentLibrary[];
}

/**
 * Defines the public SuperadminDashboardRecentActivityItem contract for dashboard overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property dotCls Value defined by the existing feature-local contract. Declared type: string.
 * @property title Display label for the owning feature. Declared type: string.
 * @property titleKey Display label for the owning feature. Declared type: string.
 * @property description Value defined by the existing feature-local contract. Declared type: string.
 * @property descriptionKey Value defined by the existing feature-local contract. Declared type: string.
 * @property timeLabel Display label for the owning feature. Declared type: string.
 * @property timeLabelKey Display label for the owning feature. Declared type: string.
 * @property href Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminDashboardRecentActivityItem {
  id: string;
  dotCls: string;
  title: string;
  titleKey?: string;
  description: string;
  descriptionKey?: string;
  timeLabel: string;
  timeLabelKey?: string;
  href: string;
}

/**
 * Defines the public SuperadminDashboardSystemHealthPanelProps contract for dashboard overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property data Value defined by the existing feature-local contract. Declared type: SuperadminDashboardSystemHealth.
 */
export interface SuperadminDashboardSystemHealthPanelProps { data: SuperadminDashboardSystemHealth; }
/**
 * Defines the public SuperadminDashboardActionItemsPanelProps contract for dashboard overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property data Value defined by the existing feature-local contract. Declared type: SuperadminDashboardActionItem[].
 */
export interface SuperadminDashboardActionItemsPanelProps { data: SuperadminDashboardActionItem[]; }
/**
 * Defines the public SuperadminDashboardRecentLibrariesTableProps contract for dashboard overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property data Value defined by the existing feature-local contract. Declared type: SuperadminDashboardRecentLibrary[].
 */
export interface SuperadminDashboardRecentLibrariesTableProps { data: SuperadminDashboardRecentLibrary[]; }

/**
 * Defines the public SuperadminDashboardRecentActivityFeedProps contract for dashboard overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property items Value defined by the existing feature-local contract. Declared type: SuperadminDashboardRecentActivityItem[].
 */
export interface SuperadminDashboardRecentActivityFeedProps { items: SuperadminDashboardRecentActivityItem[]; }
