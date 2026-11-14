import { z } from 'zod';

/** Client-only validation contract for local waitlist preview controls; this is not an API payload schema. */
export const superadminLibrariesWaitlistAutomationSettingsSchema = z.object({
  template: z.string().trim().min(1, 'COPY.MESSAGE_TEMPLATE_REQUIRED'),
  delay: z.number({
    required_error: 'COPY.NOTIFICATION_DELAY_REQUIRED',
    invalid_type_error: 'COPY.NOTIFICATION_DELAY_INTEGER',
  }).int('COPY.NOTIFICATION_DELAY_INTEGER').min(0, 'COPY.NOTIFICATION_DELAY_NON_NEGATIVE'),
});

export type SuperadminLibrariesWaitlistAutomationSettings = z.infer<typeof superadminLibrariesWaitlistAutomationSettingsSchema>;
