export interface ManagerDashboardOverviewKpiData {
  title: string;
  value: string | number;
  trend: string;
  icon: string;
  iconClass: string;
}

export interface ManagerDashboardOverviewSeatData {
  id: string;
  status: string;
}

export interface ManagerDashboardOverviewActionItem {
  title: string;
  count: string;
  countClass: string;
  showRenew: boolean;
  href: string;
}

export interface ManagerDashboardOverviewRecentAdmission {
  name: string;
  smartId: string;
  shift: string;
}

export interface ManagerDashboardOverviewRecentEnquiry {
  id?: string;
  name: string;
  phone: string;
  status: string;
}

export interface ManagerDashboardOverviewData {
  kpiData: ManagerDashboardOverviewKpiData[];
  seatData: ManagerDashboardOverviewSeatData[];
  actionItems: ManagerDashboardOverviewActionItem[];
  recentAdmissions: ManagerDashboardOverviewRecentAdmission[];
  recentEnquiries: ManagerDashboardOverviewRecentEnquiry[];
}
