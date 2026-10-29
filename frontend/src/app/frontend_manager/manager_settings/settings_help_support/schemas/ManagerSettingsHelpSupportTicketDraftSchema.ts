import { z } from 'zod';

/** Local ticket-draft validation only; this is not a support API contract. */
export const managerHelpSupportTicketDraftSchema = z.object({
  category: z.enum(['billing', 'technical', 'feature', 'account', 'general']),
  subject: z.string().trim().min(1),
  description: z.string().trim().min(1),
  priority: z.enum(['Low', 'Medium', 'High']),
});

export type ManagerSettingsHelpSupportTicketDraft = z.infer<typeof managerHelpSupportTicketDraftSchema>;
