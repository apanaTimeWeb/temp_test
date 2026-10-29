import type { ManagerDashboardOverviewData } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewTypes';
import { ManagerDashboardOverviewDataSchema } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/schemas/ManagerDashboardOverviewSchema';

/** The supplied frontend contract does not define an external dashboard overview API endpoint. */
export class ManagerDashboardOverviewContractBlockedError extends Error {
  readonly code = 'EXTERNAL_PRODUCT_DECISION_BLOCKED' as const;

  constructor() {
    super('Dashboard overview cannot be loaded until an authoritative API contract is supplied.');
    this.name = 'ManagerDashboardOverviewContractBlockedError';
  }
}

export const HARDCODED_DASHBOARD_DATA: ManagerDashboardOverviewData = ManagerDashboardOverviewDataSchema.parse({
  kpiData: [
    { title: 'Total Members', value: 142, trend: '+12% this month', icon: 'Users' },
    { title: 'Today Attendance', value: 89, trend: '63% capacity', icon: 'CalendarCheck' },
    { title: 'New Inquiries', value: 7, trend: '+3 today', icon: 'Phone' },
    { title: 'Seats Occupied', value: '45/60', trend: '75% occupied', icon: 'Armchair' },
  ],
  seatData: [
    { id: 'S-01', status: 'occupied' },
    { id: 'S-02', status: 'occupied' },
    { id: 'S-03', status: 'available' },
    { id: 'S-04', status: 'expiring' },
    { id: 'S-05', status: 'available' },
    { id: 'S-06', status: 'occupied' },
  ],
  actionItems: [
    { title: 'Fees due today', count: '4' },
    { title: 'Renewals due', count: '6' },
    { title: 'New enquiries', count: '5' },
  ],
  recentAdmissions: [
    { name: 'Rahul Sharma', smartId: 'SM-1042', shift: 'Morning' },
    { name: 'Priya Verma', smartId: 'SM-1043', shift: 'Full Day' },
    { name: 'Amit Singh', smartId: 'SM-1044', shift: 'Evening' },
  ],
  recentEnquiries: [
    { name: 'Vikram Mehta', phone: '+91 98765 43210', status: 'New' },
    { name: 'Ananya Gupta', phone: '+91 98765 43211', status: 'Interested' },
    { name: 'Suresh Kumar', phone: '+91 98765 43212', status: 'Visited' },
  ],
});

export async function fetchManagerDashboardData(options?: { fallbackToMock?: boolean }): Promise<ManagerDashboardOverviewData> {
  if (options?.fallbackToMock || process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
    return HARDCODED_DASHBOARD_DATA;
  }
  throw new ManagerDashboardOverviewContractBlockedError();
}
