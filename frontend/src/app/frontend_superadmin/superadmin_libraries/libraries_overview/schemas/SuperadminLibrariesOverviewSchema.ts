// RESPONSIBILITY: Define validation schemas for libraries overview; schema validity does not replace server-side validation.
// FLOW: Feature form/API boundary -> superadmin_libraries/libraries_overview/schemas/SuperadminLibrariesOverviewSchema.ts -> parsed/validated input -> typed feature action.
import { z } from 'zod';
import { SUPERADMIN_LIBRARIES_PLAN_VALUES } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/constants/SuperadminLibrariesOverviewConstants';

/** Schema for preview edits; no server API contract is present in the supplied ZIP. */
export const SUPERADMIN_LIBRARIES_EDIT_SCHEMA = z.object({
  name: z.string({ error: "SUPERADMIN_LIBRARIES.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_LIBRARIES.VALIDATION.ENTER_A_LIBRARY_NAME").max(120, "SUPERADMIN_LIBRARIES.VALIDATION.LIBRARY_NAME_MUST_BE_120_CHARACTERS_OR_FEWER"),
  owner: z.string({ error: "SUPERADMIN_LIBRARIES.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_LIBRARIES.VALIDATION.ENTER_THE_OWNER_NAME").max(120, "SUPERADMIN_LIBRARIES.VALIDATION.OWNER_NAME_MUST_BE_120_CHARACTERS_OR_FEWER"),
  email: z.string({ error: "SUPERADMIN_LIBRARIES.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().email("SUPERADMIN_LIBRARIES.VALIDATION.ENTER_A_VALID_EMAIL_ADDRESS").max(254, "SUPERADMIN_LIBRARIES.VALIDATION.EMAIL_MUST_BE_254_CHARACTERS_OR_FEWER"),
  phone: z.string({ error: "SUPERADMIN_LIBRARIES.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().max(32, "SUPERADMIN_LIBRARIES.VALIDATION.PHONE_NUMBER_MUST_BE_32_CHARACTERS_OR_FEWER"),
  gstNumber: z.string({ error: "SUPERADMIN_LIBRARIES.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().max(32, "SUPERADMIN_LIBRARIES.VALIDATION.GST_IDENTIFIER_MUST_BE_32_CHARACTERS_OR_FEWER"),
  location: z.string({ error: "SUPERADMIN_LIBRARIES.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_LIBRARIES.VALIDATION.ENTER_A_LOCATION").max(120, "SUPERADMIN_LIBRARIES.VALIDATION.LOCATION_MUST_BE_120_CHARACTERS_OR_FEWER"),
  plan: z.enum(SUPERADMIN_LIBRARIES_PLAN_VALUES, { error: "SUPERADMIN_LIBRARIES.VALIDATION.SELECT_A_VALID_OPTION" }),
}, { error: "SUPERADMIN_LIBRARIES.VALIDATION.PROVIDE_VALID_FORM_DATA" });

/**
 * Defines the public SuperadminLibrariesEditFormValues contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminLibrariesEditFormValues = z.infer<typeof SUPERADMIN_LIBRARIES_EDIT_SCHEMA>;
