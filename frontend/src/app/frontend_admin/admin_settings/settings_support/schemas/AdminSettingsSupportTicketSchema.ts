import { z } from 'zod';
import { ADMIN_SUPPORT_TICKET_CATEGORIES, ADMIN_SUPPORT_TICKET_PRIORITIES } from '@/app/frontend_admin/admin_settings/settings_support/config/admin_settings_support.url_config';

export const AdminSupportTicketSchema = z.object({
  category: z.enum(ADMIN_SUPPORT_TICKET_CATEGORIES, { required_error: 'Select a ticket category.' }),
  priority: z.enum(ADMIN_SUPPORT_TICKET_PRIORITIES, { required_error: 'Select a priority.' }),
  subject: z.string().trim().min(1, 'Enter a ticket subject.').max(160, 'Subject must be 160 characters or fewer.'),
  description: z.string().trim().min(1, 'Describe the issue.').max(5000, 'Description must be 5,000 characters or fewer.'),
});

export type AdminSupportTicketFormValues = z.infer<typeof AdminSupportTicketSchema>;
