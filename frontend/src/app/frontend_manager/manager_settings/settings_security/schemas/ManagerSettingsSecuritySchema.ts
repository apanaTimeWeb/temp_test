import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (@#$!%*?&)'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirmation do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password cannot be the same as current password',
    path: ['newPassword'],
  });

export const twoFactorVerificationSchema = z.object({
  totpCode: z
    .string()
    .length(6, 'Authentication code must be exactly 6 digits')
    .regex(/^[0-9]+$/, 'Code must contain only digits'),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type TwoFactorVerificationInput = z.infer<typeof twoFactorVerificationSchema>;
