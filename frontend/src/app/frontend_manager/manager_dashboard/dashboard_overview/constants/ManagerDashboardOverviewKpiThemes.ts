import { MANAGER_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/config/manager_dashboard_overview.url_config';
import type { ManagerDashboardOverviewKpiData } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewTypes';
import type { DashboardTimeRange } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_sections/ManagerDashboardOverviewHeaderBar';

export interface ManagerDashboardKpiTheme {
  cardBg: string;
  iconBox: string;
  badge: string;
  valColor: string;
  titleColor: string;
  strokeClass: string;
  textMuted: string;
  accent: string;
  progress: string;
  glow: string;
}

const INDIGO_THEME: ManagerDashboardKpiTheme = {
  cardBg: 'mgr-kpi-surface--indigo border-indigo-500/40 shadow-lg shadow-indigo-950/40 hover:border-indigo-400/60 hover:shadow-indigo-950/60',
  iconBox: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400',
  badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  valColor: 'text-white',
  titleColor: 'text-indigo-300',
  strokeClass: 'text-indigo-400',
  textMuted: 'text-indigo-200/70',
  accent: 'text-indigo-400',
  progress: 'from-indigo-500 to-indigo-400',
  glow: 'bg-indigo-500/20 group-hover:bg-indigo-500/30',
};

const AMBER_THEME: ManagerDashboardKpiTheme = {
  cardBg: 'mgr-kpi-surface--amber border-amber-500/40 shadow-lg shadow-amber-950/40 hover:border-amber-400/60 hover:shadow-amber-950/60',
  iconBox: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
  badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  valColor: 'text-amber-400',
  titleColor: 'text-amber-300',
  strokeClass: 'text-amber-400',
  textMuted: 'text-amber-200/70',
  accent: 'text-amber-400',
  progress: 'from-amber-500 to-amber-400',
  glow: 'bg-amber-500/20 group-hover:bg-amber-500/30',
};

const EMERALD_THEME: ManagerDashboardKpiTheme = {
  cardBg: 'mgr-kpi-surface--emerald border-emerald-500/40 shadow-lg shadow-emerald-950/40 hover:border-emerald-400/60 hover:shadow-emerald-950/60',
  iconBox: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
  badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  valColor: 'text-emerald-400',
  titleColor: 'text-emerald-300',
  strokeClass: 'text-emerald-400',
  textMuted: 'text-emerald-200/70',
  accent: 'text-emerald-400',
  progress: 'from-emerald-500 to-emerald-400',
  glow: 'bg-emerald-500/20 group-hover:bg-emerald-500/30',
};

const SKY_THEME: ManagerDashboardKpiTheme = {
  cardBg: 'mgr-kpi-surface--sky border-sky-500/40 shadow-lg shadow-sky-950/40 hover:border-sky-400/60 hover:shadow-sky-950/60',
  iconBox: 'bg-sky-500/20 border-sky-500/40 text-sky-400',
  badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  valColor: 'text-sky-400',
  titleColor: 'text-sky-300',
  strokeClass: 'text-sky-400',
  textMuted: 'text-cyan-200/70',
  accent: 'text-sky-400',
  progress: 'from-sky-500 to-sky-400',
  glow: 'bg-sky-500/20 group-hover:bg-sky-500/30',
};

const PURPLE_THEME: ManagerDashboardKpiTheme = {
  cardBg: 'mgr-kpi-surface--purple border-purple-500/40 shadow-lg shadow-purple-950/40 hover:border-purple-400/60 hover:shadow-purple-950/60',
  iconBox: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
  badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  valColor: 'text-purple-300',
  titleColor: 'text-purple-300',
  strokeClass: 'text-purple-400',
  textMuted: 'text-purple-200/70',
  accent: 'text-purple-400',
  progress: 'from-purple-500 to-purple-400',
  glow: 'bg-purple-500/20 group-hover:bg-purple-500/30',
};

export function getManagerDashboardKpiRoute(title: string): string {
  switch (title) {
    case 'Total Students':
    case 'Total Members':
    case 'Active Students':
    case 'Active Members':
      return MANAGER_DASHBOARD_OVERVIEW_ROUTES.STUDENTS;
    case 'Expiring Members':
    case 'Expiring Soon':
    case 'Renewals Due':
      return MANAGER_DASHBOARD_OVERVIEW_ROUTES.FINANCE_RENEWALS;
    case 'Attendance Today':
    case 'Today Attendance':
      return MANAGER_DASHBOARD_OVERVIEW_ROUTES.ENGAGEMENT_ATTENDANCE;
    case 'New Enquiries':
    case 'New Inquiries':
      return MANAGER_DASHBOARD_OVERVIEW_ROUTES.CRM_ENQUIRIES;
    case 'Occupied Seats':
    case 'Seats Occupied':
      return '/frontend_manager/manager_seats_shifts_lockers/seats_matrix';
    default:
      return MANAGER_DASHBOARD_OVERVIEW_ROUTES.STUDENTS;
  }
}

export function getManagerDashboardKpiTheme(title: ManagerDashboardOverviewKpiData['title']): ManagerDashboardKpiTheme {
  switch (title) {
    case 'Expiring Members':
    case 'Expiring Soon':
    case 'Renewals Due':
      return AMBER_THEME;
    case 'Attendance Today':
    case 'Today Attendance':
      return EMERALD_THEME;
    case 'New Enquiries':
    case 'New Inquiries':
      return SKY_THEME;
    case 'Occupied Seats':
    case 'Seats Occupied':
      return PURPLE_THEME;
    default:
      return INDIGO_THEME;
  }
}

export function getManagerDashboardKpiSubtitle(title: string, timeRange: DashboardTimeRange): string {
  switch (title) {
    case 'Total Students':
    case 'Total Members':
      return 'Active enrolled students';
    case 'Expiring Members':
    case 'Expiring Soon':
    case 'Renewals Due':
      return 'Subscriptions expiring soon';
    case 'Attendance Today':
    case 'Today Attendance':
      if (timeRange === 'this_week') return 'Total check-ins this week';
      if (timeRange === 'this_month') return 'Monthly attendance aggregate';
      if (timeRange === 'custom') return 'Check-ins for custom period';
      return 'Check-ins recorded today';
    case 'New Enquiries':
    case 'New Inquiries':
      if (timeRange === 'this_week') return 'Leads logged this week';
      if (timeRange === 'this_month') return 'Total leads this month';
      if (timeRange === 'custom') return 'Leads in custom period';
      return 'Leads awaiting follow-up';
    case 'Occupied Seats':
    case 'Seats Occupied':
      return '75% total hall capacity';
    default:
      return '';
  }
}
