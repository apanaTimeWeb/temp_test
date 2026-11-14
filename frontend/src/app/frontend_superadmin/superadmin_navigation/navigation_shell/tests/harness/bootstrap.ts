// RESPONSIBILITY: Define source-level test coverage for navigation shell using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_navigation/navigation_shell/tests/harness/bootstrap.ts -> module-local test harness/fixtures -> assertions and regression evidence.
/** Canonical standalone harness entrypoint; delegates to the preserved local bootstrap. */
export { NAVIGATION_SHELL_MOCK_SERVER, setupNavigationShellMockServer } from './SuperadminNavigationShellMockServerBootstrap';
