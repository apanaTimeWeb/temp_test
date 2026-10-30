import { addDays, differenceInCalendarDays, format, subDays } from 'date-fns';
import type { AdminSystemMaintenanceAssetFixtureNameKey, AdminSystemMaintenanceLockerFixtureIssueKey } from '@/app/frontend_admin/admin_system/system_maintenance/types/AdminSystemMaintenanceComponentTypes';


export type AdminSystemMaintenanceSeatStatus = 'OK' | 'Needs Attention';
export type AdminSystemMaintenanceAssetStatus = 'OK' | 'Due Soon' | 'Overdue';
export type AdminSystemMaintenanceLockerStatus = 'OK' | 'Issue Reported';

export interface AdminSystemMaintenanceSeatFixture {
  id: string;
  status: AdminSystemMaintenanceSeatStatus;
  lastMaint: string;
  daysSince: number;
}

export interface AdminSystemMaintenanceAssetFixture {
  nameKey: AdminSystemMaintenanceAssetFixtureNameKey;
  qty: number;
  status: AdminSystemMaintenanceAssetStatus;
  lastServiced: string;
  nextDue: string;
  daysOverdue: number;
}

export interface AdminSystemMaintenanceLockerFixture {
  id: string;
  status: AdminSystemMaintenanceLockerStatus;
  issueKey: AdminSystemMaintenanceLockerFixtureIssueKey;
  issueDate: string | null;
}

export interface AdminSystemMaintenanceFixtures {
  seats: AdminSystemMaintenanceSeatFixture[];
  assets: AdminSystemMaintenanceAssetFixture[];
  lockers: AdminSystemMaintenanceLockerFixture[];
}

/**
 * Creates date-consistent synthetic maintenance fixtures for the explicitly labeled demo preview.
 * Dates are relative to the supplied reference day so overdue counters and display dates never drift apart.
 * This data is not a live maintenance ledger and must not be used outside demo mode.
 */
export function getAdminSystemMaintenanceFixtures(referenceDate = new Date()): AdminSystemMaintenanceFixtures {
  const day = (date: Date) => format(date, 'yyyy-MM-dd');
  const daysAgo = (days: number) => subDays(referenceDate, days);
  const daysAhead = (days: number) => addDays(referenceDate, days);
  const seats = [
    { id: 'S-01', status: 'Needs Attention' as const, lastMaint: day(daysAgo(89)), daysSince: 89 },
    { id: 'S-07', status: 'OK' as const, lastMaint: day(daysAgo(22)), daysSince: 22 },
    { id: 'S-14', status: 'Needs Attention' as const, lastMaint: day(daysAgo(101)), daysSince: 101 },
    { id: 'S-22', status: 'OK' as const, lastMaint: day(daysAgo(10)), daysSince: 10 },
  ];
  const assets = [
    { nameKey: 'ASSET_AC_UNIT' as const, qty: 1, status: 'Overdue' as const, lastServiced: day(daysAgo(120)), nextDue: day(daysAgo(55)), daysOverdue: differenceInCalendarDays(referenceDate, daysAgo(55)) },
    { nameKey: 'ASSET_CEILING_FAN' as const, qty: 8, status: 'Due Soon' as const, lastServiced: day(daysAgo(120)), nextDue: day(daysAhead(9)), daysOverdue: -differenceInCalendarDays(daysAhead(9), referenceDate) },
    { nameKey: 'ASSET_CCTV' as const, qty: 4, status: 'OK' as const, lastServiced: day(daysAgo(35)), nextDue: day(daysAhead(60)), daysOverdue: -differenceInCalendarDays(daysAhead(60), referenceDate) },
  ];
  const lockers = [
    { id: 'L-03', status: 'Issue Reported' as const, issueKey: 'LOCKER_ISSUE_JAM' as const, issueDate: day(daysAgo(6)) },
    { id: 'L-11', status: 'OK' as const, issueKey: 'LOCKER_ISSUE_NONE' as const, issueDate: null },
    { id: 'L-19', status: 'Issue Reported' as const, issueKey: 'LOCKER_ISSUE_HINGE' as const, issueDate: day(daysAgo(8)) },
  ];
  return { seats, assets, lockers };
}
