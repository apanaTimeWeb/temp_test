// RESPONSIBILITY: Define stable module-owned constants for libraries profile configuration; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_libraries/libraries_profile_configuration/constants/SuperadminLibrariesProfileConfigurationStaticConstants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminLibrariesProfileConfigurationButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_SIZE = { sm: 'sys-btn--sm', md: '', lg: 'sys-btn--lg', icon: 'sys-btn--icon' };


/** Static module-owned options/status mapping extracted from SuperadminLibrariesProfileConfigurationButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_VARIANT = {
  primary: 'sys-btn-primary', ghost: 'sys-btn-ghost', destructive: 'sys-btn-danger',
  secondary: 'sys-btn-ghost', link: 'sys-btn-link',
};
