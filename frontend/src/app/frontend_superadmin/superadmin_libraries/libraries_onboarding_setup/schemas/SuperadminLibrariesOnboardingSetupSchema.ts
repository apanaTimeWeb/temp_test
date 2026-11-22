// FLOW: Feature form/API boundary -> superadmin_libraries/libraries_onboarding_setup/schemas/SuperadminLibrariesOnboardingSetupSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Setup Wizard Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

// ─── Step 1: Branch Details ────────────────────────────────────────────────────
export const branchDetailsSchema = z.object({
  name:    z.string({ required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).min(2, "SUPERADMIN_SETUP_WIZARD.VALIDATION.LIBRARY_NAME_IS_REQUIRED"),
  address: z.string({ required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).min(5, "SUPERADMIN_SETUP_WIZARD.VALIDATION.FULL_ADDRESS_IS_REQUIRED"),
  city:    z.string({ required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).min(2, "SUPERADMIN_SETUP_WIZARD.VALIDATION.CITY_IS_REQUIRED"),
  gst:     z.string({ required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional(),
}, { required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_VALID_FORM_DATA", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_VALID_FORM_DATA" });

// ─── Step 2: Define Shifts ─────────────────────────────────────────────────────
export const shiftSchema = z.object({
  name:  z.string({ required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).min(1, "SUPERADMIN_SETUP_WIZARD.VALIDATION.SHIFT_NAME_IS_REQUIRED"),
  start: z.string({ required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "SUPERADMIN_SETUP_WIZARD.VALIDATION.START_TIME_INVALID_FORMAT"),
  end:   z.string({ required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "SUPERADMIN_SETUP_WIZARD.VALIDATION.END_TIME_INVALID_FORMAT"),
}, { required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_VALID_FORM_DATA", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_VALID_FORM_DATA" }).refine((shift) => { const [startHour, startMinute] = shift.start.split(':').map(Number); const [endHour, endMinute] = shift.end.split(':').map(Number); return endHour * 60 + endMinute > startHour * 60 + startMinute; }, { message: "SUPERADMIN_SETUP_WIZARD.VALIDATION.END_TIME_MUST_FOLLOW_START_TIME", path: ['end'] });
export const shiftsSchema = z.object({
  shifts: z.array(shiftSchema, { required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_A_VALID_LIST", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_A_VALID_LIST" }).min(1, "SUPERADMIN_SETUP_WIZARD.VALIDATION.AT_LEAST_ONE_SHIFT_IS_REQUIRED"),
}, { required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_VALID_FORM_DATA", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_VALID_FORM_DATA" });

// ─── Step 3: Add Seats ────────────────────────────────────────────────────────
export const seatsSchema = z.object({
  count:  z.number({ required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_NUMBER", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_NUMBER" }).int("SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_NUMBER").min(1, "SUPERADMIN_SETUP_WIZARD.VALIDATION.AT_LEAST_1_SEAT_REQUIRED").max(9999, "SUPERADMIN_SETUP_WIZARD.VALIDATION.SEAT_COUNT_MUST_BE_9999_OR_FEWER"),
  prefix: z.string({ required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).max(3, "SUPERADMIN_SETUP_WIZARD.VALIDATION.MAX_3_CHARACTERS").min(1, "SUPERADMIN_SETUP_WIZARD.VALIDATION.PREFIX_REQUIRED"),
}, { required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_VALID_FORM_DATA", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_VALID_FORM_DATA" });

// ─── Step 4: Fee Plans ────────────────────────────────────────────────────────
export const planSchema = z.object({
  name:  z.string({ required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).min(1, "SUPERADMIN_SETUP_WIZARD.VALIDATION.PLAN_NAME_REQUIRED"),
  days:  z.number({ required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_NUMBER", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_NUMBER" }).int("SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_NUMBER").min(1, "SUPERADMIN_SETUP_WIZARD.VALIDATION.MINIMUM_1_DAY"),
  price: z.number({ required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_NUMBER", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.ENTER_A_VALID_NUMBER" }).min(0, "SUPERADMIN_SETUP_WIZARD.VALIDATION.PRICE_CANNOT_BE_NEGATIVE"),
}, { required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_VALID_FORM_DATA", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_VALID_FORM_DATA" });
export const plansSchema = z.object({
  plans: z.array(planSchema, { required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_A_VALID_LIST", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_A_VALID_LIST" }).min(1, "SUPERADMIN_SETUP_WIZARD.VALIDATION.AT_LEAST_ONE_PLAN_REQUIRED"),
}, { required_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_VALID_FORM_DATA", invalid_type_error: "SUPERADMIN_SETUP_WIZARD.VALIDATION.PROVIDE_VALID_FORM_DATA" });
