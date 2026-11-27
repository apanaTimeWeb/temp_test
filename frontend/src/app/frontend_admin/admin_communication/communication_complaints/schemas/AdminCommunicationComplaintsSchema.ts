import { z } from 'zod';

export interface AdminCommunicationValidationMessages {
  complaintTitleRequired: string;
  complaintDescriptionRequired: string;
}

const DEFAULT_MESSAGES: AdminCommunicationValidationMessages = {
  complaintTitleRequired: 'Enter a complaint title.',
  complaintDescriptionRequired: 'Describe the complaint.',
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

export const AdminCommunicationComplaintApiSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  subject: z.string(),
  description: z.string(),
  status: z.string().trim().min(1).max(40),
  createdAt: z.string().trim().min(1).max(64).refine((value) => isAdminCommunicationValidDate(value), 'Expected a valid creation date'),
});

export const AdminCommunicationComplaintListSchema = z.array(AdminCommunicationComplaintApiSchema);

export type AdminCommunicationComplaintApiRecord = z.infer<typeof AdminCommunicationComplaintApiSchema>;
