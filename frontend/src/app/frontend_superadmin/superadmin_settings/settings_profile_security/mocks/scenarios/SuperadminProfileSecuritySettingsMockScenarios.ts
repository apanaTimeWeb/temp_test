// RESPONSIBILITY: Define scenario metadata for settings profile security; network/auth cases remain non-executable without verified host contracts.
// FLOW: Test harness -> superadmin_settings/settings_profile_security/mocks/scenarios/SuperadminProfileSecuritySettingsMockScenarios.ts -> declared scenario state -> fixture-backed UI or explicitly deferred contract case.
/** Scenario inventory is intentionally read-only until the host supplies approved contracts. */
export const SUPERADMINPROFILESECURITYSETTINGS_MOCK_SCENARIOS = [{ id: 'local-preview', durableWritesEnabled: false }] as const;
