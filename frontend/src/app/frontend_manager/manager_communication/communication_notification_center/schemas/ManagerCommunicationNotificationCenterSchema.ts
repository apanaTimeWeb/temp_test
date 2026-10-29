import { z } from 'zod';

/** Validate ISO date/date-time strings as actual calendar values before mapping. */
const managerCommunicationIsoDateSchema = z.string().refine((value) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/.test(value)) return false;
  const [datePart] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  return calendarDate.getUTCFullYear() === year && calendarDate.getUTCMonth() === month - 1 && calendarDate.getUTCDate() === day && Number.isFinite(Date.parse(value));
}, 'Expected a valid ISO calendar date or ISO date-time');

export const managerCommunicationNoticeResponseSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  message: z.string(),
  createdAt: managerCommunicationIsoDateSchema,
  validTill: managerCommunicationIsoDateSchema,
});

export const managerCommunicationComplaintResponseSchema = z.object({
  id: z.string().min(1),
  subject: z.string(),
  description: z.string(),
  createdAt: managerCommunicationIsoDateSchema,
  status: z.enum(['open', 'in_progress', 'resolved']),
});

export const managerCommunicationNoticeResponseListSchema = z.array(managerCommunicationNoticeResponseSchema);
export const managerCommunicationComplaintResponseListSchema = z.array(managerCommunicationComplaintResponseSchema);
