// RESPONSIBILITY: Define scenario metadata for settings profile overview; network/auth cases remain non-executable without verified host contracts.
// FLOW: Test harness -> superadmin_settings/settings_profile_overview/mocks/scenarios/SuperadminProfileOverviewprofile_overview.MockScenarios.ts -> declared scenario state -> fixture-backed UI or explicitly deferred contract case.
/** UI-only test scenarios; these names do not imply backend endpoints. */
export const SUPERADMIN_PROFILE_OVERVIEW_SCENARIOS = [
  'loading',
  'empty',
  'error',
  'unavailable_mutation',
] as const;
