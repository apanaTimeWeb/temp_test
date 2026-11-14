// RESPONSIBILITY: Define validation schemas for settings profile overview; schema validity does not replace server-side validation.
// FLOW: Feature form/API boundary -> superadmin_settings/settings_profile_overview/schemas/SuperadminProfileOverviewEditSchema.ts -> parsed/validated input -> typed feature action.
import { z } from 'zod';

/** Validates profile fields for a local preview; this schema does not authorize a server mutation. */
export const SUPERADMIN_PROFILE_EDIT_SCHEMA = z.object({
  firstName: z.string({ error: "SUPERADMIN_PROFILE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_PROFILE.VALIDATION.FIRST_NAME_IS_REQUIRED").max(80, "SUPERADMIN_PROFILE.VALIDATION.FIRST_NAME_MUST_BE_80_CHARACTERS_OR_FEWER"),
  lastName: z.string({ error: "SUPERADMIN_PROFILE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_PROFILE.VALIDATION.LAST_NAME_IS_REQUIRED").max(80, "SUPERADMIN_PROFILE.VALIDATION.LAST_NAME_MUST_BE_80_CHARACTERS_OR_FEWER"),
  email: z.string({ error: "SUPERADMIN_PROFILE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().email("SUPERADMIN_PROFILE.VALIDATION.ENTER_A_VALID_EMAIL_ADDRESS"),
  phone: z.string({ error: "SUPERADMIN_PROFILE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(7, "SUPERADMIN_PROFILE.VALIDATION.ENTER_A_VALID_PHONE_NUMBER").max(24, "SUPERADMIN_PROFILE.VALIDATION.PHONE_NUMBER_IS_TOO_LONG"),
}, { error: "SUPERADMIN_PROFILE.VALIDATION.PROVIDE_VALID_FORM_DATA" });

/**
 * Defines the public SuperadminProfileEditValues contract for profile overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminProfileEditValues = z.infer<typeof SUPERADMIN_PROFILE_EDIT_SCHEMA>;

export const SUPERADMIN_PROFILE_PASSWORD_SCHEMA = z.object({
  currentPassword: z.string({ error: "SUPERADMIN_PROFILE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).min(1, "SUPERADMIN_PROFILE.VALIDATION.CURRENT_PASSWORD_IS_REQUIRED"),
  newPassword: z.string({ error: "SUPERADMIN_PROFILE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" })
    .min(12, "SUPERADMIN_PROFILE.VALIDATION.USE_AT_LEAST_12_CHARACTERS")
    .max(128, "SUPERADMIN_PROFILE.VALIDATION.PASSWORD_MUST_BE_128_CHARACTERS_OR_FEWER")
    .regex(/[A-Z]/, "SUPERADMIN_PROFILE.VALIDATION.INCLUDE_AT_LEAST_ONE_UPPERCASE_LETTER")
    .regex(/[^A-Za-z0-9]/, "SUPERADMIN_PROFILE.VALIDATION.INCLUDE_AT_LEAST_ONE_SYMBOL"),
  confirmPassword: z.string({ error: "SUPERADMIN_PROFILE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).min(1, "SUPERADMIN_PROFILE.VALIDATION.CONFIRM_YOUR_NEW_PASSWORD"),
}, { error: "SUPERADMIN_PROFILE.VALIDATION.PROVIDE_VALID_FORM_DATA" }).refine((values) => values.newPassword === values.confirmPassword, {
  path: ['confirmPassword'],
  message: "SUPERADMIN_PROFILE.VALIDATION.PASSWORDS_DO_NOT_MATCH",
}).refine((values) => values.currentPassword !== values.newPassword, {
  path: ['newPassword'],
  message: "SUPERADMIN_PROFILE.VALIDATION.CHOOSE_A_NEW_PASSWORD_DIFFERENT_FROM_THE_CURRENT_PASSWORD",
});

/**
 * Defines the public SuperadminProfilePasswordValues contract for profile overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminProfilePasswordValues = z.infer<typeof SUPERADMIN_PROFILE_PASSWORD_SCHEMA>;
