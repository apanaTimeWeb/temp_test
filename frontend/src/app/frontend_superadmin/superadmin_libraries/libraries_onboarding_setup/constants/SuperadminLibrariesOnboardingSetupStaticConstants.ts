// RESPONSIBILITY: Define stable module-owned constants for libraries onboarding setup; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_libraries/libraries_onboarding_setup/constants/SuperadminLibrariesOnboardingSetupStaticConstants.ts -> typed constants -> component/hook/config behavior.


/** Static module-owned options/status mapping extracted from SuperadminLibrariesOnboardingSetupSkipModal.tsx. */
export const SUPERADMIN_SETUP_WIZARD_SKIP_MODAL_SELECTOR = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';


