import { MANAGER_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/config/manager_dashboard_overview.url_config';
import type { ManagerDashboardOverviewQuickLink } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_sections/ManagerDashboardOverviewQuickLinks.tsx';

/** Stable, feature-owned navigation options for the manager dashboard. */
export const MANAGER_DASHBOARD_QUICK_LINKS: ManagerDashboardOverviewQuickLink[] = [
  { titleKey: 'quick_all_students', href: MANAGER_DASHBOARD_OVERVIEW_ROUTES.STUDENTS },
  { titleKey: 'quick_enquiries', href: MANAGER_DASHBOARD_OVERVIEW_ROUTES.CRM_ENQUIRIES },
  { titleKey: 'quick_collect_fee', href: MANAGER_DASHBOARD_OVERVIEW_ROUTES.FINANCE_COLLECT_FEE },
  { titleKey: 'quick_add_complaint', href: MANAGER_DASHBOARD_OVERVIEW_ROUTES.COMMUNICATION_COMPLAINTS },
  { titleKey: 'quick_mark_attendance', href: MANAGER_DASHBOARD_OVERVIEW_ROUTES.ENGAGEMENT_ATTENDANCE },
  { titleKey: 'quick_qr_scanner', href: MANAGER_DASHBOARD_OVERVIEW_ROUTES.ENGAGEMENT_QR_SCANNER },
];
