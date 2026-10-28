import { z } from 'zod';

/** Localized validation copy supplied to the module-owned Zod schema factory. */
export interface PublicAuthPasswordRecoverySchemaMessages {
  identityRequired: string;
}

/** Preserve the observed single required identity field and localized validation message. */
export const createPublicAuthPasswordRecoverySchema = (messages: PublicAuthPasswordRecoverySchemaMessages) => z.object({
  identity: z.string().trim().min(1, messages.identityRequired),
});

/** Form values inferred from the module-owned Zod schema. */
export type PublicAuthPasswordRecoveryFormData = z.infer<ReturnType<typeof createPublicAuthPasswordRecoverySchema>>;
