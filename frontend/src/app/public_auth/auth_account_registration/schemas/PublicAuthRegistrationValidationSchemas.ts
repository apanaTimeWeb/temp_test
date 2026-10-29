import { z } from 'zod';

/** Localized validation copy supplied to the module-owned Zod schema factory. */
export interface PublicAuthRegistrationSchemaMessages {
  ownerNameMin: string;
  libraryNameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  phoneRequired: string;
  phoneInvalid: string;
  passwordMin: string;
  passwordUppercase: string;
  passwordNumber: string;
  confirmPasswordRequired: string;
  passwordMismatch: string;
}

const passwordSchema = (messages: Pick<PublicAuthRegistrationSchemaMessages, 'passwordMin' | 'passwordUppercase' | 'passwordNumber'>) =>
  z.string().min(8, messages.passwordMin).regex(/[A-Z]/, messages.passwordUppercase).regex(/[0-9]/, messages.passwordNumber);

/** Validate the six visible registration fields; confirmation is client-only and is excluded from the request payload. */
export const createPublicAuthRegistrationSchema = (messages: PublicAuthRegistrationSchemaMessages) => z.object({
  ownerName: z.string().trim().min(2, messages.ownerNameMin),
  libraryName: z.string().trim().min(2, messages.libraryNameRequired),
  email: z.string().trim().min(1, messages.emailRequired).email(messages.emailInvalid),
  phone: z.string().trim().min(1, messages.phoneRequired).regex(/^\+91\s?\d{10}$/, messages.phoneInvalid),
  password: passwordSchema(messages),
  confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
}).refine((values) => values.password === values.confirmPassword, {
  message: messages.passwordMismatch,
  path: ['confirmPassword'],
});

/** Form values inferred from the module-owned Zod schema. */
export type PublicAuthRegistrationFormData = z.infer<ReturnType<typeof createPublicAuthRegistrationSchema>>;
