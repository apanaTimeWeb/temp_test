// RESPONSIBILITY: Define stable module-owned constants for libraries overview; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_libraries/libraries_overview/constants/SuperadminLibrariesOverviewConstants.ts -> typed constants -> component/hook/config behavior.
/** Authoritative UI vocabulary for the library-management feature. */
export const SUPERADMIN_LIBRARIES_STATUS_VALUES = ['Active', 'Maintenance'] as const;
/**
 * Defines the public SuperadminLibrariesStatus contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminLibrariesStatus = (typeof SUPERADMIN_LIBRARIES_STATUS_VALUES)[number];

export const SUPERADMIN_LIBRARIES_PLAN_VALUES = ['Starter', 'Pro', 'Enterprise'] as const;
/**
 * Defines the public SuperadminLibrariesPlan contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminLibrariesPlan = (typeof SUPERADMIN_LIBRARIES_PLAN_VALUES)[number];

export const SUPERADMIN_LIBRARIES_TOASTS = {
  UPDATE_SUCCESS: (name: string) => `Preview only: ${name} was changed in this page state.`,
  UPDATE_ERROR: 'The local preview could not be updated. Your server data was not changed.',
  STATUS_SUCCESS: 'Preview only: library status changed in this page state.',
  STATUS_ERROR: 'The local preview status could not be updated. Your server data was not changed.',
} as const;
