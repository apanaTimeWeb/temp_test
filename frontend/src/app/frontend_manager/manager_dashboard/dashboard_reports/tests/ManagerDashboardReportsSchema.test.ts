import { describe, expect, it } from 'vitest';
import { managerReportsSchema } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/schemas/ManagerDashboardReportsSchema';
import { MANAGER_REPORTS_EMPTY_FIXTURE, MANAGER_REPORTS_POPULATED_FIXTURE } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/mocks/manager_dashboard_reports_fixtures/ManagerDashboardReportsFixtures';

const completeEmptyReport = {
  kpiCards: [], occupancyData: [], growthData: [], attendanceData: [], absenteesChartData: [],
  complaintsData: [], absenteeRows: [], conversionRows: [], seatRows: [], lockerRows: [], maintenanceRows: [],
};

describe('managerReportsSchema', () => {
  it('accepts the complete empty response contract', () => {
    expect(managerReportsSchema.parse(completeEmptyReport)).toEqual(completeEmptyReport);
    expect(managerReportsSchema.parse(MANAGER_REPORTS_EMPTY_FIXTURE)).toEqual(MANAGER_REPORTS_EMPTY_FIXTURE);
  });
  it('accepts populated synthetic fixtures with every KPI, chart, and table collection represented', () => {
    const parsed = managerReportsSchema.parse(MANAGER_REPORTS_POPULATED_FIXTURE);
    expect(parsed.kpiCards).toHaveLength(4);
    expect(parsed.occupancyData.length).toBeGreaterThan(0);
    expect(parsed.growthData.length).toBeGreaterThan(0);
    expect(parsed.attendanceData.length).toBeGreaterThan(0);
    expect(parsed.absenteesChartData.length).toBeGreaterThan(0);
    expect(parsed.complaintsData.length).toBeGreaterThan(0);
    expect(parsed.absenteeRows.length).toBeGreaterThan(0);
    expect(parsed.conversionRows.length).toBeGreaterThan(0);
    expect(parsed.seatRows.length).toBeGreaterThan(0);
    expect(parsed.lockerRows.length).toBeGreaterThan(0);
    expect(parsed.maintenanceRows.length).toBeGreaterThan(0);
    expect(parsed.kpiCards.every((card) => card.trend === 'Synthetic sample')).toBe(true);
  });
  it('rejects responses with missing required report collections', () => {
    expect(managerReportsSchema.safeParse({}).success).toBe(false);
    expect(managerReportsSchema.safeParse({ ...completeEmptyReport, occupancyData: undefined }).success).toBe(false);
  });
  it('rejects invalid numeric values instead of coercing them to plausible values', () => {
    expect(managerReportsSchema.safeParse({ ...completeEmptyReport, occupancyData: [{ value: 'not-a-number' }] }).success).toBe(false);
    expect(managerReportsSchema.safeParse({ ...completeEmptyReport, attendanceData: [{ day: 'Mon', avg: Number.NaN }] }).success).toBe(false);
    expect(managerReportsSchema.safeParse({ ...completeEmptyReport, kpiCards: [{ title: 'Count', value: 'many', icon: 'Users' }] }).success).toBe(false);
  });
  it('rejects negative report counts, invalid percentages, and impossible locker totals', () => {
    expect(managerReportsSchema.safeParse({ ...completeEmptyReport, growthData: [{ date: '2026-01-01', joined: -1, exited: 0 }] }).success).toBe(false);
    expect(managerReportsSchema.safeParse({ ...completeEmptyReport, attendanceData: [{ day: 'Mon', avg: 101 }] }).success).toBe(false);
    expect(managerReportsSchema.safeParse({ ...completeEmptyReport, lockerRows: [{ type: 'Study', occupied: 11, total: 10, pct: '110%' }] }).success).toBe(false);
  });
  it('does not expose API-provided presentation classes in validated report data', () => {
    const result = managerReportsSchema.parse({ ...completeEmptyReport, kpiCards: [{ title: 'Count', value: 4, icon: 'Users', iconClass: 'bg-red-500' }] });
    expect(result.kpiCards[0]).not.toHaveProperty('iconClass');
  });
});
