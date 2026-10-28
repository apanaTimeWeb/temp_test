import { z } from 'zod';
/** Localized validation copy supplied to the module-owned Zod schema factory. */
export interface PublicAuthPasswordResetSchemaMessages { otpLength: string; otpDigits: string; passwordMin: string; passwordUppercase: string; passwordNumber: string; confirmPasswordRequired: string; passwordMismatch: string; }
const passwordSchema = (m: Pick<PublicAuthPasswordResetSchemaMessages, 'passwordMin' | 'passwordUppercase' | 'passwordNumber'>) => z.string().min(8, m.passwordMin).regex(/[A-Z]/, m.passwordUppercase).regex(/[0-9]/, m.passwordNumber);
export const createPublicAuthResetPasswordSchema = (m: PublicAuthPasswordResetSchemaMessages) => z.object({ otp: z.string().length(6, m.otpLength).regex(/^\d{6}$/, m.otpDigits), newPassword: passwordSchema(m), confirmPassword: z.string().min(1, m.confirmPasswordRequired) }).refine((v) => v.newPassword === v.confirmPassword, { message: m.passwordMismatch, path: ['confirmPassword'] });
/** Form values inferred from the module-owned Zod schema. */
export type PublicAuthResetPasswordFormData = z.infer<ReturnType<typeof createPublicAuthResetPasswordSchema>>;
