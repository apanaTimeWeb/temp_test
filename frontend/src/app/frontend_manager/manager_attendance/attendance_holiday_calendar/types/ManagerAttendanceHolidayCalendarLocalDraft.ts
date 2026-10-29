import { z } from 'zod';

/** Draft shape for local engagement UI state; it does not represent delivery or persistence. */
export const managerEngagementLocalDraftSchema = z.object({
  title: z.string().trim().min(1),
  message: z.string().trim().min(1),
  scheduledAt: z.string().optional(),
}).strict();
export type ManagerAttendanceHolidayCalendarLocalDraft = z.infer<typeof managerEngagementLocalDraftSchema>;
