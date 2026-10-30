import { z } from 'zod';

export interface AdminSystemBrandingPreviewValidationMessages {
  libraryNameRequired: string;
  libraryNameTooLong: string;
  taglineTooLong: string;
  colorInvalid: string;
}

/** Creates localized validation for the local branding preview; no persistence API is implied. */
export function createAdminSystemBrandingPreviewSchema(messages: AdminSystemBrandingPreviewValidationMessages) {
  return z.object({
    libraryName: z.string().trim().min(1, messages.libraryNameRequired).max(120, messages.libraryNameTooLong),
    tagline: z.string().max(180, messages.taglineTooLong),
    primaryColor: z.string().trim().regex(/^#[\da-f]{6}$/i, messages.colorInvalid),
    accentColor: z.string().trim().regex(/^#[\da-f]{6}$/i, messages.colorInvalid),
  });
}

export type AdminSystemBrandingPreviewFormValues = z.infer<ReturnType<typeof createAdminSystemBrandingPreviewSchema>>;
