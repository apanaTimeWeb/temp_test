// RESPONSIBILITY: Define stable module-owned constants for settings branding; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_settings/settings_branding/constants/SuperadminSettingsBrandingStaticConstants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminSettingsBrandingPageClient.tsx. */
export const SUPERADMIN_SYSTEM_BRANDING_PAGE_CLIENT_BRANDING_DEFAULTS = {
  libraryName: 'Library OS',
  tagline: 'Your Knowledge Hub',
};


/** Static module-owned options/status mapping extracted from SuperadminSettingsBrandingButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_SIZE = {
  sm: 'sys-btn--sm px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-xs sm:text-sm',
  lg: 'sys-btn--lg px-5 py-3 text-sm sm:text-base',
  icon: 'sys-btn--icon p-2.5',
};

/** Static module-owned options/status mapping extracted from SuperadminSettingsBrandingButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_VARIANT = {
  primary: 'sys-btn-primary inline-flex items-center justify-center gap-2 rounded-xl font-semibold bg-primary text-on-primary hover:bg-primary-hover active:scale-[0.98] transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  ghost: 'sys-btn-ghost inline-flex items-center justify-center gap-2 rounded-xl font-semibold border border-border/80 bg-card/60 text-secondary hover:text-primary hover:bg-surface-hover active:scale-[0.98] transition-all cursor-pointer',
  destructive: 'sys-btn-danger inline-flex items-center justify-center gap-2 rounded-xl font-semibold bg-danger text-on-danger hover:bg-danger/90 active:scale-[0.98] transition-all shadow-md shadow-danger/20 cursor-pointer',
  secondary: 'sys-btn-ghost inline-flex items-center justify-center gap-2 rounded-xl font-semibold border border-border/80 bg-surface-subtle text-secondary hover:text-primary hover:bg-surface-hover active:scale-[0.98] transition-all cursor-pointer',
  link: 'sys-btn-link text-primary underline-offset-4 hover:underline text-xs sm:text-sm font-medium cursor-pointer',
};
