import { z } from 'zod';
import { PUBLIC_AUTH_ROLE_IDS } from '@/app/public_auth/auth_sign_in/utils/PublicAuthSignInConstants';

/** Localized validation copy supplied to the module-owned Zod schema factory. */
export interface PublicAuthSignInSchemaMessages {
  emailRequired: string;
  passwordRequired: string;
}

/** Validate the existing login form without guessing whether the backend accepts phone numbers as identifiers. */
export const createPublicAuthLoginSchema = (messages: PublicAuthSignInSchemaMessages) => z.object({
  email: z.string().trim().min(1, messages.emailRequired),
  password: z.string().min(1, messages.passwordRequired),
  role: z.enum(PUBLIC_AUTH_ROLE_IDS),
});

/** Form values inferred from the module-owned Zod schema. */
export type PublicAuthLoginFormData = z.infer<ReturnType<typeof createPublicAuthLoginSchema>>;
