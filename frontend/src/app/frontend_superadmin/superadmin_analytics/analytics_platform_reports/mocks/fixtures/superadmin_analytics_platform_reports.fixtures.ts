// mocks/fixtures/superadmin_analytics_platform_reports.fixtures.ts
// Fixtures with 3-tier scale support for Superadmin Platform Reports

import type { PlatformReportsOverviewData, PlatformReportTableRecord } from '../../types/SuperadminAnalyticsPlatformReportsTypes';

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Jaipur', 'Ahmedabad', 'Lucknow', 'Indore', 'Kolkata'];
const STATES = ['Maharashtra', 'Delhi NCR', 'Karnataka', 'Maharashtra', 'Telangana', 'Rajasthan', 'Gujarat', 'Uttar Pradesh', 'Madhya Pradesh', 'West Bengal'];
const PLANS = ['Starter Plan', 'Professional Plan', 'Enterprise Elite', 'Multi-Branch Pro'];
const STATUSES = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'SUSPENDED', 'INACTIVE', 'CHURNED'] as const;
const PAYMENT_STATUSES = ['PAID', 'PAID', 'PAID', 'PENDING', 'OVERDUE', 'FAILED'] as const;

export function generatePlatformReportMockRecords(count: number): PlatformReportTableRecord[] {
  return Array.from({ length: count }, (_, idx) => {
    const idNum = idx + 1;
    const cityIdx = idx % CITIES.length;
    const status = STATUSES[idx % STATUSES.length];
    const paymentStatus = PAYMENT_STATUSES[idx % PAYMENT_STATUSES.length];
    return {
      id: `lib-rec-${idNum.toString().padStart(4, '0')}`,
      libraryName: `Apex Central Library #${idNum}`,
      libraryCode: `LIB-${(1000 + idNum).toString()}`,
      branchCount: (idx % 6) + 1,
      city: CITIES[cityIdx],
      state: STATES[cityIdx],
      adminName: `Dr. Rohit Sharma ${idNum}`,
      adminEmail: `admin${idNum}@apexlibrary.com`,
      plan: PLANS[idx % PLANS.length],
      status,
      paymentStatus,
      createdDate: `2025-0${(idx % 9) + 1}-1${(idx % 8) + 1}`,
      lastActiveDate: '2026-11-20',
    };
  });
}

export const MOCK_PLATFORM_TIER_1_RECORDS = generatePlatformReportMockRecords(10);
export const MOCK_PLATFORM_TIER_2_RECORDS = generatePlatformReportMockRecords(100);
export const MOCK_PLATFORM_TIER_3_RECORDS = generatePlatformReportMockRecords(500);

export const MOCK_PLATFORM_REPORTS_OVERVIEW: PlatformReportsOverviewData = {
  kpis: {
    totalLibraries: 1248,
    totalBranches: 3890,
    activeAccounts: 1180,
    activeAccountsRate: 94.5,
    growthRate: 14.2,
    accountCreations: 84,
    accountCancellations: 12,
    churnRate: 0.96,
  },
  growthTimeline: [
    { period: 'Jun 2026', newLibraries: 48, newBranches: 120, activeTotal: 1040 },
    { period: 'Jul 2026', newLibraries: 55, newBranches: 142, activeTotal: 1090 },
    { period: 'Aug 2026', newLibraries: 62, newBranches: 165, activeTotal: 1135 },
    { period: 'Sep 2026', newLibraries: 70, newBranches: 180, activeTotal: 1182 },
    { period: 'Oct 2026', newLibraries: 76, newBranches: 198, activeTotal: 1220 },
    { period: 'Nov 2026', newLibraries: 84, newBranches: 220, activeTotal: 1248 },
  ],
  statusDistribution: [
    { status: 'ACTIVE', count: 1180, percentage: 94.5 },
    { status: 'SUSPENDED', count: 32, percentage: 2.6 },
    { status: 'INACTIVE', count: 24, percentage: 1.9 },
    { status: 'CHURNED', count: 12, percentage: 1.0 },
  ],
  items: MOCK_PLATFORM_TIER_1_RECORDS,
  totalCount: 1248,
  filterOptions: {
    libraries: [
      { id: 'lib-01', name: 'Apex Central Library' },
      { id: 'lib-02', name: 'National Digital Archive' },
      { id: 'lib-03', name: 'City Central Reading Hall' },
      { id: 'lib-04', name: 'Vanguard Study Spaces' },
    ],
    branches: [
      { id: 'br-01', name: 'Main Campus Branch' },
      { id: 'br-02', name: 'Downtown Study Center' },
      { id: 'br-03', name: 'West End Reading Hub' },
    ],
    plans: ['Starter Plan', 'Professional Plan', 'Enterprise Elite', 'Multi-Branch Pro'],
    statuses: ['ACTIVE', 'SUSPENDED', 'INACTIVE', 'CHURNED'],
    paymentStatuses: ['PAID', 'PENDING', 'FAILED', 'OVERDUE'],
    admins: [
      { id: 'adm-01', name: 'Dr. Rohit Sharma' },
      { id: 'adm-02', name: 'Priya Verma' },
      { id: 'adm-03', name: 'Anil Deshmukh' },
    ],
  },
};
