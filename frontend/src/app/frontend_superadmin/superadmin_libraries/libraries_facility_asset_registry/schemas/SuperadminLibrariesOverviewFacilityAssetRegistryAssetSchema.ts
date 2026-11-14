// FLOW: Feature form/API boundary -> superadmin_libraries/libraries_facility_asset_registry/schemas/SuperadminLibrariesOverviewFacilityAssetRegistryAssetSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Accounting Asset Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

const SuperadminAccountingAssetDate = z.string({ required_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).regex(/^\d{4}-\d{2}-\d{2}$/, "SUPERADMIN_ACCOUNTING.VALIDATION.CHOOSE_A_VALID_PURCHASE_DATE").refine((value) => {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, "SUPERADMIN_ACCOUNTING.VALIDATION.CHOOSE_A_VALID_CALENDAR_DATE");

export const SuperadminAccountingAssetSchema = z.object({
  name: z.string({ required_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_AN_ASSET_NAME").max(120, "SUPERADMIN_ACCOUNTING.VALIDATION.ASSET_NAME_MUST_BE_120_CHARACTERS_OR_FEWER"),
  category: z.enum(['Appliance', 'Security', 'Furniture', 'Electronics', 'Other'], { errorMap: () => ({ message: "SUPERADMIN_ACCOUNTING.VALIDATION.SELECT_A_VALID_OPTION" }) }),
  purchaseDate: SuperadminAccountingAssetDate,
  purchaseValue: z.string({ required_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().regex(/^\d+(\.\d{1,2})?$/, "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_PURCHASE_VALUE").refine((value) => Number(value) > 0, "SUPERADMIN_ACCOUNTING.VALIDATION.PURCHASE_VALUE_MUST_BE_GREATER_THAN_ZERO"),
  location: z.string({ required_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE", invalid_type_error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_THE_ASSET_LOCATION").max(120, "SUPERADMIN_ACCOUNTING.VALIDATION.LOCATION_MUST_BE_120_CHARACTERS_OR_FEWER"),
}, { required_error: "SUPERADMIN_ACCOUNTING.VALIDATION.PROVIDE_VALID_FORM_DATA", invalid_type_error: "SUPERADMIN_ACCOUNTING.VALIDATION.PROVIDE_VALID_FORM_DATA" });

/**
 * Defines the public SuperadminAccountingAssetFormValues contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminAccountingAssetFormValues = z.infer<typeof SuperadminAccountingAssetSchema>;
