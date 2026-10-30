import { z } from 'zod';
import { ADMIN_STAFF_DIRECTORY_INITIAL_STATUS_OPTIONS, ADMIN_STAFF_DIRECTORY_MANAGER_STATUS_OPTIONS } from '@/app/frontend_admin/admin_staff/staff_directory/config/admin_staff_directory.url_config';


export const AdminStaffDirectoryApiRecordSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().trim().min(1),
  username: z.string().trim().min(1),
  email: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  branch: z.string().trim().min(1),
  status: z.enum(['Active', 'Suspended', 'Deactivated']),
  lastActive: z.string().trim().min(1),
});
export const AdminStaffDirectoryApiResponseSchema = z.array(AdminStaffDirectoryApiRecordSchema);
export type AdminStaffDirectoryApiRecord = z.infer<typeof AdminStaffDirectoryApiRecordSchema>;

export interface AdminStaffDirectoryCreateManagerValidationMessages {
  nameRequired: string;
  nameTooLong: string;
  usernameTooShort: string;
  usernameTooLong: string;
  emailInvalid: string;
  phoneInvalid: string;
  phoneTooLong: string;
  branchRequired: string;
}

export function createAdminStaffDirectoryCreateManagerSchema(messages: AdminStaffDirectoryCreateManagerValidationMessages) {
  return z.object({
    fullName: z.string().trim().min(1, messages.nameRequired).max(120, messages.nameTooLong),
    username: z.string().trim().min(3, messages.usernameTooShort).max(60, messages.usernameTooLong),
    email: z.string().trim().email(messages.emailInvalid),
    phone: z.string().trim().max(20, messages.phoneTooLong).refine((value) => { const digits = value.replace(/\D/g, ''); return digits.length >= 8 && digits.length <= 15; }, messages.phoneInvalid),
    passwordSetup: z.literal('auto'),
    branchId: z.enum(['b1', 'b2'], { errorMap: () => ({ message: messages.branchRequired }) }),
    initialStatus: z.enum(ADMIN_STAFF_DIRECTORY_INITIAL_STATUS_OPTIONS),
  });
}

export const AdminStaffDirectoryCreateManagerSchema = createAdminStaffDirectoryCreateManagerSchema({
  nameRequired: 'Enter the manager name.',
  nameTooLong: 'Name must be 120 characters or fewer.',
  usernameTooShort: 'Username must contain at least 3 characters.',
  usernameTooLong: 'Username must be 60 characters or fewer.',
  emailInvalid: 'Enter a valid email address.',
  phoneInvalid: 'Enter a valid phone number.',
  phoneTooLong: 'Phone number is too long.',
  branchRequired: 'Select a branch.',
});

export type AdminStaffDirectoryCreateManagerFormValues = z.infer<typeof AdminStaffDirectoryCreateManagerSchema>;


// Canonical feature types live beside the Zod schemas that validate their API/form boundaries.

export type AdminStaffDirectoryTab = 'all' | 'add' | 'active' | 'suspended' | 'deactivated' | 'sessions' | 'history' | 'activity';
export type AdminStaffDirectoryManagerStatus = (typeof ADMIN_STAFF_DIRECTORY_MANAGER_STATUS_OPTIONS)[number];
export interface AdminStaffDirectoryManager {
  id: string; name: string; username: string; email: string; phone: string; branch: string; status: AdminStaffDirectoryManagerStatus; lastActive: string;
}
