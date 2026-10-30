import { z } from 'zod';
import type { EnquirySource, EnquiryStatus } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';
export type { EnquirySource, EnquiryStatus } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';
import { ADMIN_ENQUIRIES_ENQUIRY_SOURCE_VALUES, ADMIN_ENQUIRIES_ENQUIRY_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_enquiries/config/admin_members_enquiries.url_config';

export type AdminEnquiriesValidationMessageKey = 'VALIDATION_NAME_MIN' | 'VALIDATION_PHONE_REQUIRED' | 'VALIDATION_PHONE_FORMAT';
export type AdminEnquiriesValidationTranslator = (key: AdminEnquiriesValidationMessageKey) => string;

const defaultValidationMessages: Record<AdminEnquiriesValidationMessageKey, string> = {
  VALIDATION_NAME_MIN: 'Full name must be at least 2 characters',
  VALIDATION_PHONE_REQUIRED: 'Phone number is required',
  VALIDATION_PHONE_FORMAT: 'Enter a valid 10-digit mobile number',
};

/** Creates the same feature-owned validation contract with messages supplied by the active locale. */
export function createAdminEnquiriesAddEnquirySchema(t: AdminEnquiriesValidationTranslator) {
  return z.object({
    name: z.string().min(2, t('VALIDATION_NAME_MIN')),
    phone: z.string().min(10, t('VALIDATION_PHONE_REQUIRED')).regex(/^\d{10}$/, t('VALIDATION_PHONE_FORMAT')),
    preferredShift: z.string().optional(),
    source: z.preprocess((value) => value === '' ? undefined : value, z.enum(ADMIN_ENQUIRIES_ENQUIRY_SOURCE_VALUES).optional()),
    handledBy: z.string().optional(),
    notes: z.string().optional(),
  });
}

export const addEnquirySchema = createAdminEnquiriesAddEnquirySchema((key) => defaultValidationMessages[key]);
export type AddEnquiryFormData = z.infer<typeof addEnquirySchema>;

export type AdminEnquiriesFollowUpValidationKey = 'VALIDATION_FOLLOWUP_DATE_REQUIRED' | 'VALIDATION_FOLLOWUP_REMARK_MIN';
export type AdminEnquiriesFollowUpTranslator = (key: AdminEnquiriesFollowUpValidationKey) => string;
export function createAdminEnquiriesFollowUpSchema(t: AdminEnquiriesFollowUpTranslator) {
  return z.object({
    date: z.string().min(1, t('VALIDATION_FOLLOWUP_DATE_REQUIRED')),
    remark: z.string().min(3, t('VALIDATION_FOLLOWUP_REMARK_MIN')),
  });
}
export const followUpSchema = createAdminEnquiriesFollowUpSchema((key) => ({
  VALIDATION_FOLLOWUP_DATE_REQUIRED: 'Follow-up date is required',
  VALIDATION_FOLLOWUP_REMARK_MIN: 'Remark must be at least 3 characters',
})[key]);
export type FollowUpFormData = z.infer<typeof followUpSchema>;

export type AdminEnquiriesStatusValidationKey = 'VALIDATION_STATUS_INVALID';
export function createAdminEnquiriesUpdateStatusSchema(t: (key: AdminEnquiriesStatusValidationKey) => string) {
  return z.object({
    status: z.enum(ADMIN_ENQUIRIES_ENQUIRY_STATUS_VALUES, { errorMap: () => ({ message: t('VALIDATION_STATUS_INVALID') }) }),
  });
}
export const updateStatusSchema = createAdminEnquiriesUpdateStatusSchema(() => 'Please select a valid status');
export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;

export const markLostSchema = z.object({
  reason: z.string().optional(),
});
export type MarkLostFormData = z.infer<typeof markLostSchema>;

// Persisted demo-mode record contract; validation remains module-local and never claims backend persistence.
const AdminEnquiriesStoredFollowUpSchema = z.object({
  id: z.string(),
  date: z.string(),
  time: z.string(),
  by: z.string(),
  remark: z.string(),
});

/** Runtime shape for a persisted demo enquiry; statuses must use the module's canonical registry. */
export const AdminEnquiriesEnquiryStorageRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  shift: z.string(),
  status: z.enum(ADMIN_ENQUIRIES_ENQUIRY_STATUS_VALUES),
  addedDate: z.string(),
  source: z.string().optional(),
  notes: z.string().optional(),
  handledBy: z.string(),
  enquiryDate: z.string().optional(),
  preferredBranch: z.string().optional(),
  avatar: z.string(),
  followUps: z.array(AdminEnquiriesStoredFollowUpSchema).optional(),
  isOverdue: z.boolean().optional(),
  isToday: z.boolean().optional(),
  isUpcoming: z.boolean().optional(),
  convertedDate: z.string().optional(),
});

export const AdminEnquiriesEnquiryStoragePayloadSchema = z.object({
  version: z.number().int(),
  records: z.array(AdminEnquiriesEnquiryStorageRecordSchema),
});

export const ADMIN_ENQUIRIES_ENQUIRY_STORAGE_VERSION = 1 as const;
export const ADMIN_ENQUIRIES_ENQUIRY_STORAGE_EXPECTED_VERSION = ADMIN_ENQUIRIES_ENQUIRY_STORAGE_VERSION;
export type AdminEnquiriesEnquiryStoragePayload = z.infer<typeof AdminEnquiriesEnquiryStoragePayloadSchema>;

/** Canonical module type family; cohesive domain and detail types are co-located. */
export interface FollowUp {
  id: string;
  date: string;
  time: string;
  by: string;
  remark: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  shift: string;
  status: EnquiryStatus;
  addedDate: string;
  source?: EnquirySource | string;
  notes?: string;
  handledBy: string;
  enquiryDate?: string;
  preferredBranch?: string;
  avatar: string;
  followUps?: FollowUp[];
  isOverdue?: boolean;
  isToday?: boolean;
  isUpcoming?: boolean;
  convertedDate?: string;
}

export interface KanbanColumn {
  id: EnquiryStatus;
  label: string;
  colorClass: string;
  dotColor: string;
  cardClass: string;
  badgeClass: string;
}

export interface AdminEnquiriesEnquiryDetail extends Enquiry {
  source: string;
  preferredBranch: string;
  enquiryDate: string;
  followUps: FollowUp[];
  isOverdue: boolean;
  isToday: boolean;
  isUpcoming: boolean;
}

export interface AdminEnquiriesMarkLostModalProps { onConfirm: (reason: string) => void; onCancel: () => void; isSubmitting: boolean; }

export interface AdminEnquiriesEnquiryInfoItemProps { icon: React.ReactNode; label: string; value: string; }
