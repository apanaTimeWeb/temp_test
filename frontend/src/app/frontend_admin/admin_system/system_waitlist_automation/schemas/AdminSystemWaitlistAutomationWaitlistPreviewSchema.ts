import { z } from 'zod';

export interface AdminSystemWaitlistPreviewValidationMessages {
  delayInvalid: string;
  templateRequired: string;
  templateTooLong: string;
}

/** Creates localized validation for a local-only waitlist configuration preview. */
export function createAdminSystemWaitlistPreviewSchema(messages: AdminSystemWaitlistPreviewValidationMessages) {
  return z.object({
    enabled: z.boolean(),
    delay: z.number().int().nonnegative(messages.delayInvalid),
    template: z.string().trim().min(1, messages.templateRequired).max(2000, messages.templateTooLong),
  });
}

export type AdminSystemWaitlistPreviewFormValues = z.infer<ReturnType<typeof createAdminSystemWaitlistPreviewSchema>>;
