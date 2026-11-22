// RESPONSIBILITY: Define scenario metadata for system backup history; network/auth cases remain non-executable without verified host contracts.
// FLOW: Test harness -> superadmin_system/system_backup_history/mocks/scenarios/SuperadminBackupHistoryRestoreFlowMockScenarios.ts -> declared scenario state -> fixture-backed UI or explicitly deferred contract case.
/** Scenario inventory is intentionally read-only until the host supplies approved contracts. */
export const SUPERADMINBACKUPRESTORE_MOCK_SCENARIOS = [{ id: 'local-preview', durableWritesEnabled: false }] as const;
