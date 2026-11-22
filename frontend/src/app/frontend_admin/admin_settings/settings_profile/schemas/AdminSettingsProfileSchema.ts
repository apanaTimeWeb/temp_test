import { z } from 'zod';

export const AdminProfileEditSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter at least 2 characters for your name.').max(120, 'Name must be 120 characters or fewer.'),
  phone: z.string().trim().min(1, 'Enter a contact phone number.').max(32, 'Phone number must be 32 characters or fewer.').refine((value) => { const digits = value.replace(/\D/g, ''); return digits.length >= 8 && digits.length <= 15 && /^[+()\d.\s-]+$/.test(value); }, 'Enter a valid phone number.'),
  email: z.string().trim().email('Enter a valid email address.'),
  bio: z.string().max(500, 'Bio must be 500 characters or fewer.'),
});

export type AdminProfileEditFormValues = z.infer<typeof AdminProfileEditSchema>;

export const AdminProfilePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password.'),
  newPassword: z.string().min(1, 'Enter a new password.'),
  confirmPassword: z.string().min(1, 'Confirm your new password.'),
}).superRefine((values, context) => {
  if (values.newPassword !== values.confirmPassword) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: 'The new password and confirmation do not match.',
    });
  }
});

export type AdminProfilePasswordFormValues = z.infer<typeof AdminProfilePasswordSchema>;

// Feature-local mapping from schema issue types to the stable English/Hindi message contract.
export type AdminProfileEditField = 'fullName' | 'phone' | 'email' | 'bio';
export type AdminProfilePasswordField = 'currentPassword' | 'newPassword' | 'confirmPassword';
export type AdminProfileValidationMessageKey =
  | 'ERROR_NAME_TOO_SHORT' | 'ERROR_NAME_TOO_LONG'
  | 'ERROR_PHONE_REQUIRED' | 'ERROR_PHONE_TOO_LONG' | 'ERROR_PHONE_INVALID'
  | 'ERROR_EMAIL_INVALID' | 'ERROR_BIO_TOO_LONG'
  | 'ERROR_CURRENT_PASSWORD_REQUIRED' | 'ERROR_NEW_PASSWORD_REQUIRED'
  | 'ERROR_CONFIRM_PASSWORD_REQUIRED' | 'ERROR_PASSWORD_MISMATCH';

/** Converts schema issue types into stable locale keys so schema prose never leaks directly into the UI. */
export function getAdminProfileValidationMessageKey(
  field: AdminProfileEditField | AdminProfilePasswordField,
  errorType: string | undefined,
): AdminProfileValidationMessageKey {
  switch (field) {
    case 'fullName': return errorType === 'too_big' ? 'ERROR_NAME_TOO_LONG' : 'ERROR_NAME_TOO_SHORT';
    case 'phone':
      if (errorType === 'too_big') return 'ERROR_PHONE_TOO_LONG';
      if (errorType === 'custom') return 'ERROR_PHONE_INVALID';
      return 'ERROR_PHONE_REQUIRED';
    case 'email': return 'ERROR_EMAIL_INVALID';
    case 'bio': return 'ERROR_BIO_TOO_LONG';
    case 'currentPassword': return 'ERROR_CURRENT_PASSWORD_REQUIRED';
    case 'newPassword': return 'ERROR_NEW_PASSWORD_REQUIRED';
    case 'confirmPassword': return errorType === 'custom' ? 'ERROR_PASSWORD_MISMATCH' : 'ERROR_CONFIRM_PASSWORD_REQUIRED';
  }
}
