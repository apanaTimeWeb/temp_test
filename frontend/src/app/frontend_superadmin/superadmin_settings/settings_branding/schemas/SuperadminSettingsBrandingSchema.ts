// FLOW: Feature form/API boundary -> superadmin_settings/settings_branding/schemas/SuperadminSettingsBrandingSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin System Branding Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

const sixDigitHexColor = z.string({ error: "SUPERADMIN_SYSTEM.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().regex(/^#[0-9a-fA-F]{6}$/, "SUPERADMIN_SYSTEM.VALIDATION.ENTER_A_SIX_DIGIT_HEXADECIMAL_COLOR_SUCH_AS_FACC15");

export const SuperadminSettingsBrandingSchema = z.object({
  libraryName: z.string({ error: "SUPERADMIN_SYSTEM.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(2, "SUPERADMIN_SYSTEM.VALIDATION.LIBRARY_NAME_MUST_CONTAIN_AT_LEAST_2_CHARACTERS_A2AAB9").max(80, "SUPERADMIN_SYSTEM.VALIDATION.LIBRARY_NAME_MUST_BE_80_CHARACTERS_OR_FEWER"),
  tagline: z.string({ error: "SUPERADMIN_SYSTEM.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().max(120, "SUPERADMIN_SYSTEM.VALIDATION.TAGLINE_MUST_BE_120_CHARACTERS_OR_FEWER"),
  primaryColor: sixDigitHexColor,
  accentColor: sixDigitHexColor,
}, { error: "SUPERADMIN_SYSTEM.VALIDATION.PROVIDE_VALID_FORM_DATA" });

/**
 * Defines the public SuperadminSystemBrandingFormValues contract for settings branding. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminSystemBrandingFormValues = z.infer<typeof SuperadminSettingsBrandingSchema>;
