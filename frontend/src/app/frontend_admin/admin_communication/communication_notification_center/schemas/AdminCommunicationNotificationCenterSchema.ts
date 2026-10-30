import { z } from 'zod';
import { isAdminCommunicationValidDate } from '@/app/frontend_admin/admin_communication/communication_notification_center/schemas/AdminCommunicationNotificationCenterApiSchema';

export interface AdminCommunicationValidationMessages {
  complaintTitleRequired: string;
  complaintDescriptionRequired: string;
  noticeTitleRequired: string;
  noticeMessageRequired: string;
  noticeDateInvalid: string;
}

const DEFAULT_MESSAGES: AdminCommunicationValidationMessages = {
  complaintTitleRequired: 'Enter a complaint title.',
  complaintDescriptionRequired: 'Describe the complaint.',
  noticeTitleRequired: 'Enter a notice title.',
  noticeMessageRequired: 'Enter the notice message.',
  noticeDateInvalid: 'Choose a valid date.',
};

/** Client-side guard for complaint entry; persistence remains blocked without an approved API mutation contract. */
export function createAdminCommunicationComplaintSchema(messages: Pick<AdminCommunicationValidationMessages, 'complaintTitleRequired' | 'complaintDescriptionRequired'>) {
  return z.object({
    student: z.string(),
    anonymous: z.boolean(),
    title: z.string().trim().min(1, messages.complaintTitleRequired),
    description: z.string().trim().min(1, messages.complaintDescriptionRequired),
  });
}
export const AdminCommunicationComplaintSchema = createAdminCommunicationComplaintSchema(DEFAULT_MESSAGES);
export type AdminCommunicationComplaintFormValues = z.infer<typeof AdminCommunicationComplaintSchema>;

/** Client-side guard for notice entry; the schema does not imply that a notice can be persisted. */
export function createAdminCommunicationNoticeSchema(messages: Pick<AdminCommunicationValidationMessages, 'noticeTitleRequired' | 'noticeMessageRequired' | 'noticeDateInvalid'>) {
  return z.object({
    title: z.string().trim().min(1, messages.noticeTitleRequired),
    message: z.string().trim().min(1, messages.noticeMessageRequired),
    validTill: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, messages.noticeDateInvalid).refine(isAdminCommunicationValidDate, messages.noticeDateInvalid),
  });
}
export const AdminCommunicationNoticeSchema = createAdminCommunicationNoticeSchema(DEFAULT_MESSAGES);
export type AdminCommunicationNoticeFormValues = z.infer<typeof AdminCommunicationNoticeSchema>;
