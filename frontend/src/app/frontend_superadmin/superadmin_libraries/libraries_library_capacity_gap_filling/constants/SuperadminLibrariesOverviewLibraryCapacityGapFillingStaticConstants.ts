// RESPONSIBILITY: Define stable module-owned constants for libraries library capacity gap filling; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_libraries/libraries_library_capacity_gap_filling/constants/SuperadminLibrariesOverviewLibraryCapacityGapFillingStaticConstants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminLibrariesOverviewLibraryCapacityGapFillingBadge.tsx. */
export const SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS = {
  default: 'sys-badge--outline', primary: 'sys-badge--primary', success: 'sys-badge--success',
  warning: 'sys-badge--warning', danger: 'sys-badge--danger', info: 'sys-badge--info', outline: 'sys-badge--outline',
};


/** Static module-owned options/status mapping extracted from SuperadminLibrariesOverviewLibraryCapacityGapFillingButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_SIZE = { sm: 'sys-btn--sm', md: '', lg: 'sys-btn--lg', icon: 'sys-btn--icon' };


/** Static module-owned options/status mapping extracted from SuperadminLibrariesOverviewLibraryCapacityGapFillingButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_VARIANT = {
  primary: 'sys-btn-primary', ghost: 'sys-btn-ghost', destructive: 'sys-btn-danger',
  secondary: 'sys-btn-ghost', link: 'sys-btn-link',
};
