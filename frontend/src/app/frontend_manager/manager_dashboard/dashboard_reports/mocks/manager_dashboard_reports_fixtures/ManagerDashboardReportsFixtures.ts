import type { ManagerDashboardReportsData } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';

/** Explicitly empty, test-only response fixture. It contains no fabricated operational totals. */
export const MANAGER_REPORTS_EMPTY_FIXTURE: ManagerDashboardReportsData = {
  kpiCards: [],
  occupancyData: [],
  growthData: [],
  attendanceData: [],
  absenteesChartData: [],
  complaintsData: [],
  absenteeRows: [],
  conversionRows: [],
  seatRows: [],
  lockerRows: [],
  maintenanceRows: [],
};

/**
 * Synthetic-only populated fixture for deterministic tests and MSW preview scenarios.
 * Values are illustrative and MUST NOT be presented as real operational records.
 */
export const MANAGER_REPORTS_POPULATED_FIXTURE: ManagerDashboardReportsData = {
  kpiCards: [
    { title: 'Illustrative active students', value: '128', icon: 'Users', trend: 'Synthetic sample' },
    { title: 'Illustrative attendance', value: '86%', icon: 'CalendarCheck', trend: 'Synthetic sample' },
    { title: 'Illustrative new enquiries', value: '24', icon: 'UserPlus', trend: 'Synthetic sample' },
    { title: 'Illustrative follow-ups', value: '17', icon: 'Phone', trend: 'Synthetic sample' },
  ],
  occupancyData: [
    { name: 'Morning', value: 72 },
    { name: 'Afternoon', value: 48 },
    { name: 'Evening', value: 91 },
  ],
  growthData: [
    { date: '2026-08', joined: 18, exited: 4 },
    { date: '2026-09', joined: 23, exited: 6 },
    { date: '2026-10', joined: 16, exited: 3 },
  ],
  attendanceData: [
    { day: 'Mon', avg: 82 }, { day: 'Tue', avg: 86 }, { day: 'Wed', avg: 79 },
    { day: 'Thu', avg: 88 }, { day: 'Fri', avg: 84 }, { day: 'Sat', avg: 91 },
  ],
  absenteesChartData: [
    { name: 'Morning', absences: 5 }, { name: 'Afternoon', absences: 8 }, { name: 'Evening', absences: 3 },
  ],
  complaintsData: [
    { name: 'Facilities', value: 4 }, { name: 'Scheduling', value: 2 }, { name: 'Other', value: 1 },
  ],
  absenteeRows: [
    { name: 'Sample Student A', smartId: 'SAMPLE-1001', shift: 'Morning', daysAbsent: 3, lastPresent: '2026-10-12' },
    { name: 'Sample Student B', smartId: 'SAMPLE-1002', shift: 'Evening', daysAbsent: 2, lastPresent: '2026-10-13' },
  ],
  conversionRows: [
    { month: 'Aug 2026', newEnq: 32, converted: 11, rate: '34.4%' },
    { month: 'Sep 2026', newEnq: 41, converted: 15, rate: '36.6%' },
    { month: 'Oct 2026', newEnq: 24, converted: 8, rate: '33.3%' },
  ],
  seatRows: [
    { shift: 'Morning', occupancy: '72%', avgDuration: '54 min' },
    { shift: 'Evening', occupancy: '91%', avgDuration: '61 min' },
  ],
  lockerRows: [
    { type: 'Standard', occupied: 18, total: 24, pct: '75%' },
    { type: 'Large', occupied: 7, total: 12, pct: '58.3%' },
  ],
  maintenanceRows: [
    { item: 'Sample treadmill', location: 'Sample Zone A', reported: '2026-10-14', priority: 'High' },
    { item: 'Sample locker hinge', location: 'Sample Locker Row', reported: '2026-10-15', priority: 'Low' },
  ],
};
