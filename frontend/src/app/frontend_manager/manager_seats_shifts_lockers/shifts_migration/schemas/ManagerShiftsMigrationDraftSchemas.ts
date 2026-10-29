import { z } from 'zod';

const time = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'invalid_time');
const optionalTime = z.union([z.literal(''), time]).optional();
const money = z.string().trim().refine((value) => value === '' || (/^\d+(?:\.\d{1,2})?$/.test(value) && Number.isFinite(Number(value)) && Number(value) >= 0), 'enter_valid_amount');

export const managerSeatsShiftDraftSchema = z.object({
  name: z.string().trim().min(2, 'shift_name_required').max(40, 'shift_name_too_long'),
  startTime: time,
  endTime: time,
  active: z.boolean(),
}).superRefine((draft, context) => {
  if (draft.startTime && draft.endTime && draft.endTime <= draft.startTime) context.addIssue({ code: 'custom', path: ['endTime'], message: 'end_time_must_follow_start_time' });
});

export const managerSeatsSeatDraftSchema = z.object({
  seatNo: z.string().trim().min(1, 'seat_number_required').max(20, 'seat_number_too_long'),
  branch: z.string().trim().min(1, 'branch_required').max(80, 'branch_too_long'),
  status: z.enum(['Working', 'Maintenance', 'Broken']),
});

export const managerSeatsMaintenanceDraftSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'valid_date_required').refine((value) => { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); if (!match) return false; const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])); return date.getFullYear() === Number(match[1]) && date.getMonth() === Number(match[2]) - 1 && date.getDate() === Number(match[3]); }, 'valid_date_required'),
  remark: z.string().trim().min(3, 'remark_required').max(1000, 'remark_too_long'),
  doneBy: z.string().trim().max(100, 'technician_name_too_long'),
  newStatus: z.enum(['Working', 'Maintenance', 'Broken']),
  cost: money,
});

export const managerSeatsLockerDraftSchema = z.object({ lockerId: z.string().trim().min(1, 'locker_id_required').max(20, 'locker_id_too_long').regex(/^[A-Za-z0-9-]+$/, 'locker_id_invalid') });

export const managerSeatsShiftMigrationDraftSchema = z.object({
  selectedStudentId: z.string().min(1, 'student_required'),
  newShift: z.string().min(1, 'shift_required'),
  newSeat: z.string().min(1, 'seat_required'),
  customStart: optionalTime,
  customEnd: optionalTime,
  payMode: z.enum(['Cash', 'UPI', 'Card']),
  txnId: z.string().max(120, 'transaction_reference_too_long'),
  remark: z.string().max(2000, 'remark_too_long'),
}).superRefine((draft, context) => {
  if ((draft.customStart && !draft.customEnd) || (!draft.customStart && draft.customEnd)) context.addIssue({ code: 'custom', path: ['customEnd'], message: 'both_custom_times_required' });
  if (draft.customStart && draft.customEnd && draft.customEnd <= draft.customStart) context.addIssue({ code: 'custom', path: ['customEnd'], message: 'custom_end_must_follow_start' });
});
