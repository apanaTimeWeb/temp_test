import { z } from 'zod';

function isValidIsoCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

const optionalDateOnly = z.string().refine((value) => value === '' || isValidIsoCalendarDate(value), 'validation_choose_valid_calendar_date');
const requiredDateOnly = z.string().min(1, 'validation_choose_date').refine(isValidIsoCalendarDate, 'validation_choose_valid_calendar_date');

/** Validation for the local demo form only; it does not define a host API contract. */
export const ManagerMembersDirectoryDemoCreateSchema = z.object({
  name: z.string().trim().min(1, 'validation_enter_member_name'),
  phone: z.string().trim().min(1, 'validation_enter_phone_number'),
  email: z.union([z.literal(''), z.string().trim().email('validation_enter_valid_email')]),
  address: z.string().trim(),
  dob: optionalDateOnly,
  gender: z.enum(['Male', 'Female', 'Other']),
  department: z.string().trim(),
  membershipType: z.enum(['Basic', 'Pro', 'Enterprise']),
  joinDate: requiredDateOnly,
  expiryDate: requiredDateOnly,
  guardian: z.string().trim(),
  emergencyContact: z.string().trim(),
}).superRefine((value, context) => {
  if (isValidIsoCalendarDate(value.joinDate) && isValidIsoCalendarDate(value.expiryDate) && value.expiryDate <= value.joinDate) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['expiryDate'], message: 'validation_expiry_after_join' });
  }
});

export type ManagerMembersDirectoryDemoCreateInput = z.infer<typeof ManagerMembersDirectoryDemoCreateSchema>;
