import { z } from 'zod';

export interface AdminSystemProfileValidationMessages {
  nameRequired: string;
  nameTooLong: string;
  emailInvalid: string;
  phoneRequired: string;
  phoneTooLong: string;
  currentPasswordRequired: string;
  newPasswordTooShort: string;
  confirmPasswordRequired: string;
  passwordMismatch: string;
}

/** Creates localized validation schemas for preview form fields; persistence remains contract-blocked. */
export function createAdminSystemProfileSchema(messages: AdminSystemProfileValidationMessages) {
  return z.object({
    fullName: z.string().trim().min(1, messages.nameRequired).max(120, messages.nameTooLong),
    email: z.union([z.string().trim().email(messages.emailInvalid), z.literal('')]),
    phone: z.string().trim().min(1, messages.phoneRequired).max(32, messages.phoneTooLong),
  });
}

export function createAdminSystemChangePasswordSchema(messages: AdminSystemProfileValidationMessages) {
  return z.object({
    currentPassword: z.string().min(1, messages.currentPasswordRequired),
    newPassword: z.string().min(8, messages.newPasswordTooShort),
    confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
  }).refine((values) => values.newPassword === values.confirmPassword, {
    message: messages.passwordMismatch,
    path: ['confirmPassword'],
  });
}

export type AdminSystemProfileFormValues = z.infer<ReturnType<typeof createAdminSystemProfileSchema>>;
export type AdminSystemChangePasswordFormValues = z.infer<ReturnType<typeof createAdminSystemChangePasswordSchema>>;
