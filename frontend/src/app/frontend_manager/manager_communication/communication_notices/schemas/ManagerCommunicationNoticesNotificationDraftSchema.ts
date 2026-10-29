import { z } from 'zod';

/** Local notification composer draft only; not a messaging API contract. */
export const managerCommunicationNotificationDraftSchema = z.object({
  recipient: z.string().trim().min(1),
  type: z.enum(['Due reminder', 'Overdue reminder', 'Reservation ready', 'Membership expiry reminder', 'Manual member notification']),
  channel: z.enum(['Email', 'SMS', 'WhatsApp']),
  message: z.string().trim().min(1),
});

export type ManagerCommunicationNoticesNotificationDraft = z.infer<typeof managerCommunicationNotificationDraftSchema>;
