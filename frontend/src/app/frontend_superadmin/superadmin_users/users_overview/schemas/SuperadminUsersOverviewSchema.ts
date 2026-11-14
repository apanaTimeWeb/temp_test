// RESPONSIBILITY: Define validation schemas for users overview; schema validity does not replace server-side validation.
// FLOW: Feature form/API boundary -> superadmin_users/users_overview/schemas/SuperadminUsersOverviewSchema.ts -> parsed/validated input -> typed feature action.
import { z } from 'zod';
import {
  SUPERADMIN_USERS_ROLE_VALUES,
} from '@/app/frontend_superadmin/superadmin_users/users_overview/constants/SuperadminUsersOverviewConstants';

/** Runtime validation contract for user-access form input. */
export const SUPERADMIN_USERS_FORM_SCHEMA = z.object({
  name: z.string({ error: "SUPERADMIN_USERS.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_USERS.VALIDATION.ENTER_THE_USER_S_FULL_NAME").max(120, "SUPERADMIN_USERS.VALIDATION.NAME_MUST_BE_120_CHARACTERS_OR_FEWER"),
  username: z.string({ error: "SUPERADMIN_USERS.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(3, "SUPERADMIN_USERS.VALIDATION.USERNAME_MUST_CONTAIN_AT_LEAST_3_CHARACTERS").max(64, "SUPERADMIN_USERS.VALIDATION.USERNAME_MUST_BE_64_CHARACTERS_OR_FEWER").regex(/^[A-Za-z0-9._-]+$/, "SUPERADMIN_USERS.VALIDATION.USE_LETTERS_NUMBERS_DOTS_UNDERSCORES_OR_HYPHENS_ONLY"),
  email: z.string({ error: "SUPERADMIN_USERS.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().email("SUPERADMIN_USERS.VALIDATION.ENTER_A_VALID_EMAIL_ADDRESS").max(254, "SUPERADMIN_USERS.VALIDATION.EMAIL_MUST_BE_254_CHARACTERS_OR_FEWER"),
  role: z.enum(SUPERADMIN_USERS_ROLE_VALUES, { error: "SUPERADMIN_USERS.VALIDATION.SELECT_A_VALID_OPTION" }),
  branch: z.string({ error: "SUPERADMIN_USERS.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_USERS.VALIDATION.ENTER_AN_ASSIGNED_TENANT_OR_BRANCH").max(120, "SUPERADMIN_USERS.VALIDATION.TENANT_OR_BRANCH_MUST_BE_120_CHARACTERS_OR_FEWER"),
  twoFactor: z.boolean({ error: "SUPERADMIN_USERS.VALIDATION.CHOOSE_A_VALID_BOOLEAN_VALUE" }),
}, { error: "SUPERADMIN_USERS.VALIDATION.PROVIDE_VALID_FORM_DATA" });

/**
 * Defines the public SuperadminUsersFormValues contract for users overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminUsersFormValues = z.infer<typeof SUPERADMIN_USERS_FORM_SCHEMA>;
