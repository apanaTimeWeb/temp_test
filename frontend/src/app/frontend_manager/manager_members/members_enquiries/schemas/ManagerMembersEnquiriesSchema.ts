import { z } from 'zod';
import { MANAGER_CRM_STATUS_VALUES } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';

export const managerCrmAddEnquirySchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  preferredShift: z.string().optional(),
  source: z.string().optional(),
  handledBy: z.string().optional(),
  notes: z.string().optional(),
});
export type ManagerMembersEnquiriesAddEnquiryFormData = z.infer<typeof managerCrmAddEnquirySchema>;

export const managerCrmFollowUpDraftSchema = z.object({
  date: z.string().min(1, 'Follow-up date is required'),
  remark: z.string().min(3, 'Remark must be at least 3 characters'),
});
export type ManagerMembersEnquiriesFollowUpFormData = z.infer<typeof managerCrmFollowUpDraftSchema>;

export const managerCrmUpdateStatusSchema = z.object({
  status: z.enum(MANAGER_CRM_STATUS_VALUES, { errorMap: () => ({ message: 'Please select a valid status' }) }),
  reason: z.string().optional(),
});
export type ManagerMembersEnquiriesUpdateStatusFormData = z.infer<typeof managerCrmUpdateStatusSchema>;

export const managerCrmMarkLostSchema = z.object({ reason: z.string().optional() });
export type ManagerMembersEnquiriesMarkLostFormData = z.infer<typeof managerCrmMarkLostSchema>;

export const managerCrmFollowUpSchema = z.object({
  id: z.string(), date: z.string(), time: z.string(), by: z.string(), remark: z.string(),
});
export const managerCrmEnquirySchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  preferredShift: z.string().nullable().optional(),
  status: z.enum(MANAGER_CRM_STATUS_VALUES),
  source: z.string().nullable().optional(),
  handledBy: z.object({ name: z.string().nullable().optional() }).nullable().optional(),
  createdAt: z.string(),
  preferredBranch: z.string().nullable().optional(),
  followUps: z.array(managerCrmFollowUpSchema).nullable().optional(),
  convertedDate: z.string().nullable().optional(),
  isOverdue: z.boolean().optional(),
  isToday: z.boolean().optional(),
  isUpcoming: z.boolean().optional(),
});
export const managerCrmNormalizedEnquirySchema = z.object({
  id: z.string(), name: z.string(), phone: z.string(), shift: z.string(), status: z.enum(MANAGER_CRM_STATUS_VALUES),
  source: z.string(), handledBy: z.string(), addedDate: z.string(), enquiryDate: z.string(), preferredBranch: z.string(),
  avatar: z.string(), followUps: z.array(managerCrmFollowUpSchema), isOverdue: z.boolean().optional(), isToday: z.boolean().optional(),
  isUpcoming: z.boolean().optional(), convertedDate: z.string().optional(),
});
export const managerCrmEnquiryResponseSchema = z.array(z.union([managerCrmEnquirySchema, managerCrmNormalizedEnquirySchema]));
