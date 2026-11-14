// RESPONSIBILITY: Define scenario metadata for settings profile overview; network/auth cases remain non-executable without verified host contracts.
// FLOW: Test harness -> superadmin_settings/settings_profile_overview/mocks/scenarios/SuperadminProfileOverviewEditMockScenarios.ts -> declared scenario state -> fixture-backed UI or explicitly deferred contract case.
/** Scenario inventory is intentionally read-only until the host supplies approved contracts. */
export const SUPERADMINPROFILEEDIT_MOCK_SCENARIOS = [{ id: 'local-preview', durableWritesEnabled: false }] as const;
