import { z } from 'zod';
import { MANAGER_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/config/manager_dashboard_overview.url_config';

const ManagerDashboardOverviewKpiDataSchema = z.object({
  title: z.string().trim().min(1),
  value: z.union([z.string(), z.number().finite()]),
  trend: z.string(),
  icon: z.enum(['Users', 'CalendarCheck', 'Phone', 'Armchair']),
}).transform((item) => ({
  ...item,
  iconClass: ({
    Users: 'mgr-kpi-icon--primary',
    CalendarCheck: 'mgr-kpi-icon--success',
    Phone: 'mgr-kpi-icon--info',
    Armchair: 'mgr-kpi-icon--warning',
  } as const)[item.icon],
}));

const ManagerDashboardOverviewSeatDataSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(['available', 'occupied', 'expiring']),
});

const ManagerDashboardOverviewActionItemSchema = z.object({
  title: z.enum(['Fees due today', 'Renewals due', 'New enquiries']),
  count: z.string().regex(/^\d+$/),
}).transform((item) => {
  const config = {
    'Fees due today': { countClass: 'mgr-badge mgr-badge--danger', showRenew: false, href: MANAGER_DASHBOARD_OVERVIEW_ROUTES.FINANCE_COLLECT_FEE },
    'Renewals due': { countClass: 'mgr-badge mgr-badge--warning', showRenew: true, href: MANAGER_DASHBOARD_OVERVIEW_ROUTES.FINANCE_RENEWALS },
    'New enquiries': { countClass: 'mgr-badge mgr-badge--info', showRenew: false, href: MANAGER_DASHBOARD_OVERVIEW_ROUTES.CRM_ENQUIRIES },
  } as const;
  return { ...item, ...config[item.title] };
});

export const ManagerDashboardOverviewDataSchema = z.object({
  kpiData: z.array(ManagerDashboardOverviewKpiDataSchema),
  seatData: z.array(ManagerDashboardOverviewSeatDataSchema),
  actionItems: z.array(ManagerDashboardOverviewActionItemSchema),
  recentAdmissions: z.array(z.object({ name: z.string().trim().min(1), smartId: z.string().trim().min(1), shift: z.enum(['Morning', 'Afternoon', 'Evening', 'Night', 'Full Day']) })),
  recentEnquiries: z.array(z.object({ name: z.string().trim().min(1), phone: z.string(), status: z.enum(['New', 'Visited', 'Interested', 'Converted', 'Lost']) })),
});
