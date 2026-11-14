// RESPONSIBILITY: Define validation schemas for libraries student smart id; schema validity does not replace server-side validation.
// FLOW: Feature form/API boundary -> superadmin_libraries/libraries_student_smart_id/schemas/SuperadminLibrariesOnboardingSetupStudentSmartIdSchemaContractStatus.ts -> parsed/validated input -> typed feature action.
/**
 * Schema boundary status for student_smart_id.
 * No verified API payload schema is supplied. This is a status marker, not a Zod schema.
 * Do not validate invented fields; add the real Zod schema after the backend contract is approved.
 */
export const SUPERADMIN_STUDENT_SMART_ID_SCHEMA_CONTRACT_STATUS = {
  status: 'CONTRACT_MISSING',
  zodSchemaDefined: false,
  reason: 'No approved request/response field contract exists in the supplied archive.',
} as const;
