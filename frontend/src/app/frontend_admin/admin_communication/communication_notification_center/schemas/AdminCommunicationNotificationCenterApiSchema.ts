import { z } from "zod";


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

export const AdminCommunicationNoticeApiSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  title: z.string(),
  message: z.string(),
  createdAt: z.string().trim().min(1).max(64).refine((value) => isAdminCommunicationValidDate(value), 'Expected a valid creation date'),
  validTill: z.string().trim().min(1).max(64).refine((value) => isAdminCommunicationValidDate(value), 'Expected a valid expiry date'),
});

export const AdminCommunicationComplaintListSchema = z.array(AdminCommunicationComplaintApiSchema);
export const AdminCommunicationNoticeListSchema = z.array(AdminCommunicationNoticeApiSchema);

export type AdminCommunicationComplaintApiRecord = z.infer<typeof AdminCommunicationComplaintApiSchema>;
export type AdminCommunicationNoticeApiRecord = z.infer<typeof AdminCommunicationNoticeApiSchema>;
