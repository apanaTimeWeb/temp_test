// RESPONSIBILITY: Define stable module-owned constants for navigation shell; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellCommandPaletteConstants.ts -> typed constants -> component/hook/config behavior.
/** DOM event contract used by the shell header and command palette to open the same command surface. */
export const SUPERADMIN_NAVIGATION_OPEN_COMMAND_PALETTE_EVENT = 'superadmin-navigation:open-command-palette';
