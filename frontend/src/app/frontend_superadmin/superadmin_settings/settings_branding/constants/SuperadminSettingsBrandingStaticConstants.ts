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
  primary: 'inline-flex items-center justify-center gap-2 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-md shadow-amber-950/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  ghost: 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 hover:text-white transition-all cursor-pointer',
  destructive: 'inline-flex items-center justify-center gap-2 rounded-xl font-bold bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white transition-all shadow-md shadow-rose-950/40 cursor-pointer',
  secondary: 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold border border-indigo-500/30 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer',
  link: 'text-purple-400 underline-offset-4 hover:underline text-xs sm:text-sm font-medium cursor-pointer',
};
