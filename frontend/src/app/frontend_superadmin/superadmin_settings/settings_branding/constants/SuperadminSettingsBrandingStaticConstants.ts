// RESPONSIBILITY: Define stable module-owned constants for settings branding; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_settings/settings_branding/constants/SuperadminSettingsBrandingStaticConstants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminSettingsBrandingPageClient.tsx. */
export const SUPERADMIN_SYSTEM_BRANDING_PAGE_CLIENT_BRANDING_DEFAULTS = {
  libraryName: 'Library OS',
  tagline: 'Your Knowledge Hub',
};


/** Static module-owned options/status mapping extracted from SuperadminSettingsBrandingButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_SIZE = { sm: 'sys-btn--sm', md: '', lg: 'sys-btn--lg', icon: 'sys-btn--icon' };


/** Static module-owned options/status mapping extracted from SuperadminSettingsBrandingButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_VARIANT = {
  primary: 'sys-btn-primary', ghost: 'sys-btn-ghost', destructive: 'sys-btn-danger',
  secondary: 'sys-btn-ghost', link: 'sys-btn-link',
};
