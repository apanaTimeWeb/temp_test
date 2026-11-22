// RESPONSIBILITY: Define scenario metadata for system backup overview; network/auth cases remain non-executable without verified host contracts.
// FLOW: Test harness -> superadmin_system/system_backup_overview/mocks/scenarios/SuperadminBackupOverviewbackup_overview.MockScenarios.ts -> declared scenario state -> fixture-backed UI or explicitly deferred contract case.
/** UI-only test scenarios; these names do not imply backend endpoints. */
export const SUPERADMIN_BACKUP_OVERVIEW_SCENARIOS = [
  'loading',
  'empty',
  'error',
  'unavailable_mutation',
] as const;
