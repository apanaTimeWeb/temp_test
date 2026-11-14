// RESPONSIBILITY: Define validation schemas for system backup history; schema validity does not replace server-side validation.
// FLOW: Feature form/API boundary -> superadmin_system/system_backup_history/schemas/SuperadminBackupHistorySchemaContractStatus.ts -> parsed/validated input -> typed feature action.
/**
 * Schema boundary status for backup_history.
 * No verified API payload schema is supplied. This is a status marker, not a Zod schema.
 * Do not validate invented fields; add the real Zod schema after the backend contract is approved.
 */
export const SUPERADMIN_BACKUP_HISTORY_SCHEMA_CONTRACT_STATUS = {
  status: 'CONTRACT_MISSING',
  zodSchemaDefined: false,
  reason: 'No approved request/response field contract exists in the supplied archive.',
} as const;
