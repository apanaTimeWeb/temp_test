// RESPONSIBILITY: Define validation schemas for libraries library waitlist automation; schema validity does not replace server-side validation.
// FLOW: Feature form/API boundary -> superadmin_libraries/libraries_library_waitlist_automation/schemas/SuperadminLibrariesOverviewLibraryWaitlistAutomationSchemaContractStatus.ts -> parsed/validated input -> typed feature action.
/**
 * Schema boundary status for library_waitlist_automation.
 * No verified API payload schema is supplied. The separately named client-only settings schema validates only local preview controls.
 * It does not define an API request/response payload; add that boundary only after the backend contract is approved.
 */
export const SUPERADMIN_LIBRARY_WAITLIST_AUTOMATION_SCHEMA_CONTRACT_STATUS = {
  status: 'CONTRACT_MISSING',
  zodSchemaDefined: false,
  reason: 'No approved request/response field contract exists in the supplied archive.',
} as const;
