// RESPONSIBILITY: Define stable module-owned constants for libraries profile configuration; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_libraries/libraries_profile_configuration/constants/SuperadminLibrariesProfileConfigurationStaticConstants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminLibrariesProfileConfigurationButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_SIZE = {
  sm: 'sys-btn--sm px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2 text-sm gap-2 rounded-xl',
  lg: 'sys-btn--lg px-5 py-2.5 text-base gap-2.5 rounded-xl',
  icon: 'sys-btn--icon p-2 text-sm aspect-square rounded-xl',
};

/** Static module-owned options/status mapping extracted from SuperadminLibrariesProfileConfigurationButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_VARIANT = {
  primary: 'sys-btn-primary bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-500/25 cursor-pointer',
  ghost: 'sys-btn-ghost border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-white cursor-pointer',
  destructive: 'sys-btn-danger border border-rose-500/40 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 hover:text-rose-100 cursor-pointer',
  secondary: 'sys-btn-ghost border border-border bg-card hover:bg-surface-hover text-slate-200 cursor-pointer',
  link: 'sys-btn-link text-indigo-400 hover:text-indigo-300 underline-offset-4 hover:underline cursor-pointer',
};
