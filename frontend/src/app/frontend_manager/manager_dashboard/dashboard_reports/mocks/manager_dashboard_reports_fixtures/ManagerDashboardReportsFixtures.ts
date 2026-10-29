import type { ManagerDashboardReportsData, ManagerDashboardReportsDateRange } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';

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

/** Weekly operational report preview fixture. */
export const MANAGER_REPORTS_WEEK_FIXTURE: ManagerDashboardReportsData = {
  kpiCards: [
    { title: 'Active Students', value: '134', icon: 'Users', trend: '+4% this week' },
    { title: 'Average Attendance', value: '89%', icon: 'CalendarCheck', trend: '+3% vs avg' },
    { title: 'New Enquiries', value: '9', icon: 'UserPlus', trend: '+4 this week' },
    { title: 'Pending Follow-ups', value: '6', icon: 'Phone', trend: '-2 resolved' },
  ],
  occupancyData: [
    { name: 'Morning', value: 78 },
    { name: 'Afternoon', value: 52 },
    { name: 'Evening', value: 94 },
  ],
  growthData: [
    { date: '2026-10-23', joined: 4, exited: 1 },
    { date: '2026-10-25', joined: 6, exited: 0 },
    { date: '2026-10-28', joined: 5, exited: 2 },
  ],
  attendanceData: [
    { day: 'Mon', avg: 88 }, { day: 'Tue', avg: 92 }, { day: 'Wed', avg: 85 },
    { day: 'Thu', avg: 90 }, { day: 'Fri', avg: 87 }, { day: 'Sat', avg: 93 },
  ],
  absenteesChartData: [
    { name: 'Morning', absences: 3 }, { name: 'Afternoon', absences: 5 }, { name: 'Evening', absences: 2 },
  ],
  complaintsData: [
    { name: 'Facilities', value: 2 }, { name: 'Scheduling', value: 1 }, { name: 'Other', value: 1 },
  ],
  absenteeRows: [
    { name: 'Rahul Verma', smartId: 'STU-1041', shift: 'Morning', daysAbsent: 2, lastPresent: '2026-10-26' },
    { name: 'Ananya Sen', smartId: 'STU-1048', shift: 'Afternoon', daysAbsent: 1, lastPresent: '2026-10-27' },
  ],
  conversionRows: [
    { month: 'Oct 2026 W4', newEnq: 14, converted: 5, rate: '35.7%' },
    { month: 'Oct 2026 W3', newEnq: 12, converted: 4, rate: '33.3%' },
  ],
  seatRows: [
    { shift: 'Morning', occupancy: '78%', avgDuration: '56 min' },
    { shift: 'Evening', occupancy: '94%', avgDuration: '65 min' },
  ],
  lockerRows: [
    { type: 'Standard', occupied: 20, total: 24, pct: '83.3%' },
    { type: 'Large', occupied: 8, total: 12, pct: '66.7%' },
  ],
  maintenanceRows: [
    { item: 'AC Filter Cleaning', location: 'Quiet Study Hall', reported: '2026-10-26', priority: 'Medium' },
    { item: 'Desk Light Replacement', location: 'Row 4 Desk B', reported: '2026-10-28', priority: 'Low' },
  ],
};

/**
 * Standard monthly operational report preview fixture.
 */
export const MANAGER_REPORTS_POPULATED_FIXTURE: ManagerDashboardReportsData = {
  kpiCards: [
    { title: 'Active students', value: '142', icon: 'Users', trend: 'Synthetic sample' },
    { title: 'Average attendance', value: '86%', icon: 'CalendarCheck', trend: 'Synthetic sample' },
    { title: 'New enquiries', value: '24', icon: 'UserPlus', trend: 'Synthetic sample' },
    { title: 'Follow-ups', value: '17', icon: 'Phone', trend: 'Synthetic sample' },
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
    { name: 'Rahul Sharma', smartId: 'STU-1001', shift: 'Morning', daysAbsent: 3, lastPresent: '2026-10-12' },
    { name: 'Priya Verma', smartId: 'STU-1002', shift: 'Evening', daysAbsent: 2, lastPresent: '2026-10-13' },
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
    { item: 'Ergonomic Chair #12', location: 'Silent Zone A', reported: '2026-10-14', priority: 'High' },
    { item: 'Locker #44 Key Lock', location: 'Locker Bay 2', reported: '2026-10-15', priority: 'Low' },
  ],
};

/** 30-day operational report preview fixture. */
export const MANAGER_REPORTS_LAST30_FIXTURE: ManagerDashboardReportsData = {
  kpiCards: [
    { title: 'Active Students', value: '139', icon: 'Users', trend: '+9% last 30d' },
    { title: 'Average Attendance', value: '85%', icon: 'CalendarCheck', trend: '+2% last 30d' },
    { title: 'New Enquiries', value: '28', icon: 'UserPlus', trend: '+11 last 30d' },
    { title: 'Pending Follow-ups', value: '21', icon: 'Phone', trend: '-5 resolved' },
  ],
  occupancyData: [
    { name: 'Morning', value: 70 },
    { name: 'Afternoon', value: 46 },
    { name: 'Evening', value: 89 },
  ],
  growthData: [
    { date: '2026-08', joined: 16, exited: 5 },
    { date: '2026-09', joined: 22, exited: 7 },
    { date: '2026-10', joined: 19, exited: 4 },
  ],
  attendanceData: [
    { day: 'Mon', avg: 80 }, { day: 'Tue', avg: 84 }, { day: 'Wed', avg: 81 },
    { day: 'Thu', avg: 86 }, { day: 'Fri', avg: 83 }, { day: 'Sat', avg: 88 },
  ],
  absenteesChartData: [
    { name: 'Morning', absences: 6 }, { name: 'Afternoon', absences: 9 }, { name: 'Evening', absences: 4 },
  ],
  complaintsData: [
    { name: 'Facilities', value: 5 }, { name: 'Scheduling', value: 3 }, { name: 'Other', value: 2 },
  ],
  absenteeRows: [
    { name: 'Vikram Mehta', smartId: 'STU-1003', shift: 'Morning', daysAbsent: 4, lastPresent: '2026-10-09' },
    { name: 'Deepak Patel', smartId: 'STU-1004', shift: 'Evening', daysAbsent: 3, lastPresent: '2026-10-11' },
  ],
  conversionRows: [
    { month: 'Aug 2026', newEnq: 30, converted: 10, rate: '33.3%' },
    { month: 'Sep 2026', newEnq: 38, converted: 14, rate: '36.8%' },
    { month: 'Oct 2026', newEnq: 28, converted: 10, rate: '35.7%' },
  ],
  seatRows: [
    { shift: 'Morning', occupancy: '70%', avgDuration: '52 min' },
    { shift: 'Evening', occupancy: '89%', avgDuration: '59 min' },
  ],
  lockerRows: [
    { type: 'Standard', occupied: 17, total: 24, pct: '70.8%' },
    { type: 'Large', occupied: 7, total: 12, pct: '58.3%' },
  ],
  maintenanceRows: [
    { item: 'Wi-Fi Access Point 2', location: 'First Floor Study', reported: '2026-10-10', priority: 'High' },
    { item: 'Water Dispenser Sensor', location: 'Cafeteria Wing', reported: '2026-10-12', priority: 'Medium' },
  ],
};

/** Selects appropriate operational reports fixture based on the requested date range. */
export function getManagerReportsFixture(dateRange: ManagerDashboardReportsDateRange): ManagerDashboardReportsData {
  switch (dateRange) {
    case 'This Week':
      return MANAGER_REPORTS_WEEK_FIXTURE;
    case 'Last 30 Days':
      return MANAGER_REPORTS_LAST30_FIXTURE;
    case 'This Month':
    default:
      return MANAGER_REPORTS_POPULATED_FIXTURE;
  }
}
