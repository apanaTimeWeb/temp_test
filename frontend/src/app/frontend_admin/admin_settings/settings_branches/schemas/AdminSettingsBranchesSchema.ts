import { z } from 'zod';
import { ADMIN_BRANCHES_STATUS_OPTIONS } from '@/app/frontend_admin/admin_settings/settings_branches/config/admin_settings_branches.url_config';
import type { AdminBranchesStatus } from '@/app/frontend_admin/admin_settings/settings_branches/config/admin_settings_branches.url_config';
export type { AdminBranchesStatus } from '@/app/frontend_admin/admin_settings/settings_branches/config/admin_settings_branches.url_config';

export interface AdminBranchesCreateValidationMessages {
  nameRequired: string; nameTooShort: string; nameTooLong: string;
  codeRequired: string; codeInvalid: string; codeTooLong: string;
  addressRequired: string; addressTooLong: string;
  phoneInvalid: string; phoneTooLong: string;
  emailInvalid: string; emailTooLong: string;
}

const DEFAULT_MESSAGES: AdminBranchesCreateValidationMessages = {
  nameRequired: 'Branch name is required.', nameTooShort: 'Branch name must be at least 2 characters.', nameTooLong: 'Branch name must be 120 characters or fewer.',
  codeRequired: 'Branch code is required.', codeInvalid: 'Use letters, numbers, and hyphens only.', codeTooLong: 'Branch code must be 32 characters or fewer.',
  addressRequired: 'Address is required.', addressTooLong: 'Address must be 240 characters or fewer.',
  phoneInvalid: 'Enter a valid contact phone number.', phoneTooLong: 'Phone number must be 32 characters or fewer.',
  emailInvalid: 'Enter a valid contact email.', emailTooLong: 'Email must be 254 characters or fewer.',
};

export function createAdminBranchesCreateFormSchema(messages: AdminBranchesCreateValidationMessages) {
  return z.object({
    name: z.string().trim().min(1, messages.nameRequired).min(2, messages.nameTooShort).max(120, messages.nameTooLong),
    code: z.string().trim().min(1, messages.codeRequired).regex(/^[A-Za-z0-9-]+$/, messages.codeInvalid).max(32, messages.codeTooLong),
    address: z.string().trim().min(1, messages.addressRequired).max(240, messages.addressTooLong),
    phone: z.string().trim().min(8, messages.phoneInvalid).max(32, messages.phoneTooLong).refine((value) => /^[+()\d\s.-]+$/.test(value) && (value.match(/\d/g)?.length ?? 0) >= 8 && (value.match(/\d/g)?.length ?? 0) <= 15, messages.phoneInvalid),
    email: z.string().trim().email(messages.emailInvalid).max(254, messages.emailTooLong),
  });
}

export const AdminBranchesCreateFormSchema = createAdminBranchesCreateFormSchema(DEFAULT_MESSAGES);
export type AdminBranchesCreateFormValues = z.infer<typeof AdminBranchesCreateFormSchema>;

export const AdminBranchesApiRecordSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().trim().min(1),
  code: z.string().trim().min(1),
  address: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z.string().trim().min(1),
  manager: z.string().trim().min(1),
  status: z.enum(ADMIN_BRANCHES_STATUS_OPTIONS),
});

export const AdminBranchesApiResponseSchema = z.array(AdminBranchesApiRecordSchema);
export type AdminBranchesApiRecord = z.infer<typeof AdminBranchesApiRecordSchema>;


// Domain types co-located with their Zod validation/API schemas for this isolated module.
export type AdminSettingsBranchesTab = 'all' | 'create' | 'active' | 'suspended' | 'archived' | 'managers' | 'settings' | 'usage' | 'reports';
export type AdminBranchesDetailTab = 'overview' | 'users' | 'members' | 'reservations' | 'reports' | 'audit' | 'settings';
export interface AdminBranchesBranch {
  id: string; name: string; code: string; address: string; phone: string; email: string; manager: string; status: AdminBranchesStatus;
}

// Status values remain owned by the canonical URL/domain config.
