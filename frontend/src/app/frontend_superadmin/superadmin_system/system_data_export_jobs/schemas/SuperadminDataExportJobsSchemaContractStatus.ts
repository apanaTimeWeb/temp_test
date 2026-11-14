// RESPONSIBILITY: Define validation schemas for system data export jobs; schema validity does not replace server-side validation.
// FLOW: Feature form/API boundary -> superadmin_system/system_data_export_jobs/schemas/SuperadminDataExportJobsSchemaContractStatus.ts -> parsed/validated input -> typed feature action.
/**
 * Schema boundary status for data_export_jobs.
 * No verified API payload schema is supplied. This is a status marker, not a Zod schema.
 * Do not validate invented fields; add the real Zod schema after the backend contract is approved.
 */
export const SUPERADMIN_DATA_EXPORT_JOBS_SCHEMA_CONTRACT_STATUS = {
  status: 'CONTRACT_MISSING',
  zodSchemaDefined: false,
  reason: 'No approved request/response field contract exists in the supplied archive.',
} as const;
