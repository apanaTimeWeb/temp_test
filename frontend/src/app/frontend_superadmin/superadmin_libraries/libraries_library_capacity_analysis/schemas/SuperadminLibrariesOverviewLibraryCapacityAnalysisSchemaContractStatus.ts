// RESPONSIBILITY: Define validation schemas for libraries library capacity analysis; schema validity does not replace server-side validation.
// FLOW: Feature form/API boundary -> superadmin_libraries/libraries_library_capacity_analysis/schemas/SuperadminLibrariesOverviewLibraryCapacityAnalysisSchemaContractStatus.ts -> parsed/validated input -> typed feature action.
/**
 * Schema boundary status for library_capacity_analysis.
 * No verified API payload schema is supplied. This is a status marker, not a Zod schema.
 * Do not validate invented fields; add the real Zod schema after the backend contract is approved.
 */
export const SUPERADMIN_LIBRARY_CAPACITY_ANALYSIS_SCHEMA_CONTRACT_STATUS = {
  status: 'CONTRACT_MISSING',
  zodSchemaDefined: false,
  reason: 'No approved request/response field contract exists in the supplied archive.',
} as const;
