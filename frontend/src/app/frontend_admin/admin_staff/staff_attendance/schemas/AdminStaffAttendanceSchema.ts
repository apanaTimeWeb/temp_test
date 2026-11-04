import { z } from 'zod';

export const AttendanceStatusSchema = z.enum(['PRESENT', 'LATE', 'ABSENT', 'ON_LEAVE']);
export type AttendanceStatus = z.infer<typeof AttendanceStatusSchema>;

export const StaffShiftTypeSchema = z.enum(['MORNING', 'EVENING', 'NIGHT']);
export type StaffShiftType = z.infer<typeof StaffShiftTypeSchema>;

export const StaffAttendanceRecordSchema = z.object({
  id: z.string(),
  staffId: z.string(),
  staffName: z.string(),
  role: z.string(),
  avatarUrl: z.string().optional(),
  branchId: z.string(),
  branchName: z.string(),
  shiftType: StaffShiftTypeSchema,
  shiftTiming: z.string(),
  date: z.string(),
  clockIn: z.string().nullable(),
  clockOut: z.string().nullable(),
  totalHours: z.number().nullable(),
  status: AttendanceStatusSchema,
  notes: z.string().optional(),
});
export type StaffAttendanceRecord = z.infer<typeof StaffAttendanceRecordSchema>;

export const StaffRosterSlotSchema = z.object({
  id: z.string(),
  staffId: z.string(),
  staffName: z.string(),
  role: z.string(),
  branchId: z.string(),
  branchName: z.string(),
  shiftType: StaffShiftTypeSchema,
  timing: z.string(),
  daysActive: z.array(z.string()),
});
export type StaffRosterSlot = z.infer<typeof StaffRosterSlotSchema>;

export const RegularizeAttendanceInputSchema = z.object({
  recordId: z.string().min(1, 'Record ID is required'),
  newStatus: AttendanceStatusSchema,
  clockIn: z.string().min(1, 'Clock-in time is required'),
  clockOut: z.string().optional(),
  reason: z.string().min(3, 'Reason must be at least 3 characters'),
});
export type RegularizeAttendanceInput = z.infer<typeof RegularizeAttendanceInputSchema>;

export const StaffLeaveRequestSchema = z.object({
  id: z.string(),
  staffId: z.string(),
  staffName: z.string(),
  role: z.string(),
  branchId: z.string(),
  branchName: z.string(),
  leaveType: z.enum(['CASUAL', 'SICK', 'VACATION', 'UNPAID']),
  startDate: z.string(),
  endDate: z.string(),
  daysCount: z.number(),
  reason: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});
export type StaffLeaveRequest = z.infer<typeof StaffLeaveRequestSchema>;


