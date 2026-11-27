import { z } from 'zod';

export interface AdminCommunicationValidationMessages {
  noticeTitleRequired: string;
  noticeMessageRequired: string;
  noticeDateInvalid: string;
}

const DEFAULT_MESSAGES: AdminCommunicationValidationMessages = {
  noticeTitleRequired: 'Enter a notice title.',
  noticeMessageRequired: 'Enter the notice message.',
  noticeDateInvalid: 'Choose a valid date.',
};

/** Client-side guard for notice entry; the schema does not imply that a notice can be persisted. */
export function createAdminCommunicationNoticeSchema(messages: Pick<AdminCommunicationValidationMessages, 'noticeTitleRequired' | 'noticeMessageRequired' | 'noticeDateInvalid'>) {
  return z.object({
    title: z.string().trim().min(1, messages.noticeTitleRequired),
    message: z.string().trim().min(1, messages.noticeMessageRequired),
    validTill: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, messages.noticeDateInvalid),
    targetBranch: z.string().optional(),
    sendWhatsApp: z.boolean().optional(),
    sendEmail: z.boolean().optional(),
    sendSms: z.boolean().optional(),
    priority: z.enum(['STANDARD', 'URGENT', 'EMERGENCY']).optional(),
    isEmergency: z.boolean().optional(),
  });
}
export const AdminCommunicationNoticeSchema = createAdminCommunicationNoticeSchema(DEFAULT_MESSAGES);
export type AdminCommunicationNoticeFormValues = z.infer<typeof AdminCommunicationNoticeSchema>;

/** Accepts valid ISO date-only values or parseable instants; rejects rollover calendar dates. */
export function isAdminCommunicationValidDate(value: string): boolean {
  const datePrefix = /^(\d{4})-(\d{2})-(\d{2})(?:$|[T ])/.exec(value);
  if (datePrefix) {
    const year = Number(datePrefix[1]); const month = Number(datePrefix[2]); const day = Number(datePrefix[3]);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return false;
  }
  return Number.isFinite(Date.parse(value));
}

export const AdminCommunicationNoticeApiSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  title: z.string(),
  message: z.string(),
  createdAt: z.string().trim().min(1).max(64).refine((value) => isAdminCommunicationValidDate(value), 'Expected a valid creation date'),
  validTill: z.string().trim().min(1).max(64).refine((value) => isAdminCommunicationValidDate(value), 'Expected a valid expiry date'),
});

export const AdminCommunicationNoticeListSchema = z.array(AdminCommunicationNoticeApiSchema);

export type AdminCommunicationNoticeApiRecord = z.infer<typeof AdminCommunicationNoticeApiSchema>;
