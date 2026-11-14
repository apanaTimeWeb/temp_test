// FLOW: Feature form/API boundary -> superadmin_libraries/libraries_profile_configuration/schemas/SuperadminLibrariesProfileConfigurationSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin System Profile Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

export const SuperadminLibrariesProfileConfigurationSchema = z.object({
  fullName: z.string({ error: "SUPERADMIN_SYSTEM.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(2, "SUPERADMIN_SYSTEM.VALIDATION.NAME_MUST_CONTAIN_AT_LEAST_2_CHARACTERS").max(120, "SUPERADMIN_SYSTEM.VALIDATION.NAME_MUST_BE_120_CHARACTERS_OR_FEWER"),
  email: z.string({ error: "SUPERADMIN_SYSTEM.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().email("SUPERADMIN_SYSTEM.VALIDATION.ENTER_A_VALID_EMAIL_ADDRESS").max(254, "SUPERADMIN_SYSTEM.VALIDATION.EMAIL_MUST_BE_254_CHARACTERS_OR_FEWER"),
  phone: z.string({ error: "SUPERADMIN_SYSTEM.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().regex(/^\+?[0-9() -]{7,24}$/, "SUPERADMIN_SYSTEM.VALIDATION.ENTER_A_VALID_PHONE_NUMBER_USING_DIGITS_AND_COMMON_SEPARATORS").refine(value => /[0-9]/.test(value), "SUPERADMIN_SYSTEM.VALIDATION.ENTER_A_VALID_PHONE_NUMBER_USING_DIGITS_AND_COMMON_SEPARATORS"),
}, { error: "SUPERADMIN_SYSTEM.VALIDATION.PROVIDE_VALID_FORM_DATA" });

/**
 * Defines the public SuperadminSystemProfileFormValues contract for libraries profile configuration. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminSystemProfileFormValues = z.infer<typeof SuperadminLibrariesProfileConfigurationSchema>;
