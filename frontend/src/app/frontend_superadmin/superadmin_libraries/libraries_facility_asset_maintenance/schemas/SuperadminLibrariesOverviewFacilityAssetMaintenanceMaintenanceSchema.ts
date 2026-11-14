// FLOW: Feature form/API boundary -> superadmin_libraries/libraries_facility_asset_maintenance/schemas/SuperadminLibrariesOverviewFacilityAssetMaintenanceMaintenanceSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Accounting Maintenance Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

const SuperadminAccountingMaintenanceDate = z.string({ required_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).regex(/^\d{4}-\d{2}-\d{2}$/, "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_DATE").refine((value) => {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_CALENDAR_DATE");

export const SuperadminAccountingMaintenanceSchema = z.object({
  assetName: z.string({ required_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_AN_ASSET_NAME").max(120, "SUPERADMIN_ACCOUNTING.VALIDATION.ASSET_NAME_MUST_BE_120_CHARACTERS_OR_FEWER"),
  issue: z.string({ required_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_ACCOUNTING.VALIDATION.DESCRIBE_THE_MAINTENANCE_ISSUE").max(500, "SUPERADMIN_ACCOUNTING.VALIDATION.ISSUE_DESCRIPTION_MUST_BE_500_CHARACTERS_OR_FEWER"),
  reportedDate: SuperadminAccountingMaintenanceDate,
  scheduledDate: SuperadminAccountingMaintenanceDate,
  vendor: z.string({ required_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().max(120, "SUPERADMIN_ACCOUNTING.VALIDATION.VENDOR_NAME_MUST_BE_120_CHARACTERS_OR_FEWER"),
  cost: z.string({ required_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().refine((value) => value === '' || /^\d+(\.\d{1,2})?$/.test(value), "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_COST_WITH_UP_TO_TWO_DECIMAL_PLACES").refine((value) => value === '' || Number(value) >= 0, "SUPERADMIN_ACCOUNTING.VALIDATION.COST_CANNOT_BE_NEGATIVE"),
}, { required_error: "SUPERADMIN_ACCOUNTING.VALIDATION.PROVIDE_VALID_FORM_DATA", invalid_type_error: "SUPERADMIN_ACCOUNTING.VALIDATION.PROVIDE_VALID_FORM_DATA" }).superRefine((values, context) => {
  if (values.scheduledDate < values.reportedDate) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['scheduledDate'], message: "SUPERADMIN_ACCOUNTING.VALIDATION.SCHEDULED_DATE_CANNOT_BE_BEFORE_THE_REPORTED_DATE" });
  }
});

/**
 * Defines the public SuperadminAccountingMaintenanceFormValues contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminAccountingMaintenanceFormValues = z.infer<typeof SuperadminAccountingMaintenanceSchema>;
