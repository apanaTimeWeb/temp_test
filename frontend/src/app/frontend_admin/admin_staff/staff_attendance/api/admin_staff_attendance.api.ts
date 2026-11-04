import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import {
  ADMIN_STAFF_ATTENDANCE_FIXTURES,
  ADMIN_STAFF_ROSTER_FIXTURES,
} from '@/app/frontend_admin/admin_staff/staff_attendance/mocks/scenarios/admin_staff_attendance.scenarios';
import type {
  StaffAttendanceRecord,
  StaffRosterSlot,
  RegularizeAttendanceInput,
} from '@/app/frontend_admin/admin_staff/staff_attendance/schemas/AdminStaffAttendanceSchema';

export async function fetchAdminStaffAttendanceList(): Promise<StaffAttendanceRecord[]> {
  if (isFrontendDemoModeEnabled()) {
    return Promise.resolve([...ADMIN_STAFF_ATTENDANCE_FIXTURES]);
  }
  return Promise.resolve([...ADMIN_STAFF_ATTENDANCE_FIXTURES]);
}

export async function fetchAdminStaffRosterSlots(): Promise<StaffRosterSlot[]> {
  if (isFrontendDemoModeEnabled()) {
    return Promise.resolve([...ADMIN_STAFF_ROSTER_FIXTURES]);
  }
  return Promise.resolve([...ADMIN_STAFF_ROSTER_FIXTURES]);
}

export async function regularizeStaffAttendance(input: RegularizeAttendanceInput): Promise<{ success: boolean; record: StaffAttendanceRecord }> {
  const existing = ADMIN_STAFF_ATTENDANCE_FIXTURES.find((r) => r.id === input.recordId);
  const updated: StaffAttendanceRecord = existing
    ? {
        ...existing,
        status: input.newStatus,
        clockIn: input.clockIn,
        clockOut: input.clockOut ?? existing.clockOut,
        notes: `Admin regularized: ${input.reason}`,
      }
    : {
        id: input.recordId,
        staffId: 'STF-001',
        staffName: 'Staff Member',
        role: 'Assistant',
        branchId: 'BR-001',
        branchName: 'Downtown Central',
        shiftType: 'MORNING',
        shiftTiming: '07:00 AM - 03:00 PM',
        date: new Date().toISOString().split('T')[0],
        clockIn: input.clockIn,
        clockOut: input.clockOut ?? null,
        totalHours: 8.0,
        status: input.newStatus,
        notes: input.reason,
      };

  return Promise.resolve({ success: true, record: updated });
}

