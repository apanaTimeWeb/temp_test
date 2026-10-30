import { z } from 'zod';
import type { AdminMembersStatus } from '@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config';
import type { AdminMembersRenewalUnit } from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';


/** Client-side validation contract for the visible member creation form only. */
export const AdminMembersCreateSchema = z.object({
  name: z.string().trim().min(2, 'VALIDATION.MEMBER_NAME_TOO_SHORT').max(120, 'VALIDATION.MEMBER_NAME_TOO_LONG'),
  email: z.string().trim().email('VALIDATION.MEMBER_EMAIL_INVALID').max(254, 'VALIDATION.MEMBER_EMAIL_TOO_LONG'),
  phone: z.string().trim().min(7, 'VALIDATION.MEMBER_PHONE_TOO_SHORT').max(32, 'VALIDATION.MEMBER_PHONE_TOO_LONG'),
  plan: z.string().trim().min(1, 'VALIDATION.MEMBER_PLAN_REQUIRED').max(120, 'VALIDATION.MEMBER_PLAN_TOO_LONG'),
});

export type AdminMembersCreateFormValues = z.infer<typeof AdminMembersCreateSchema>;

// Canonical member domain types co-located with the client schema for standalone module portability.
export type AdminMembersDirectoryTab = 'all' | 'add' | 'categories' | 'departments' | 'plans' | 'renewal' | 'active' | 'expired' | 'suspended' | 'blocked' | 'import' | 'export' | 'documents';
export type AdminMembersDetailTab = 'profile' | 'membership' | 'renewalHistory' | 'paymentHistory' | 'lostHistory' | 'activityHistory' | 'documents' | 'attendance';

export interface AdminMembersMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: AdminMembersStatus;
  expiryDate: string;
}

/** Demo-only mutable records used by the Members secondary management views. */
export interface AdminMembersCategory {
  name: string;
  members: number;
  color: string;
}

export interface AdminMembersDepartment {
  name: string;
  head: string;
  members: number;
}

export interface AdminMembersRenewal {
  member: string;
  plan: string;
  expiresIn: { value: number; unit: AdminMembersRenewalUnit };
  reminderRecorded: boolean;
}

export type AdminMembersDemoMutationResult = 'created' | 'invalid' | 'duplicate' | 'blocked';
