// FLOW: Feature consumers -> superadmin_libraries/libraries_onboarding_setup/constants/SuperadminLibrariesOnboardingSetupConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Setup Wizard Constants; centralizes stable module-owned options and configuration. */
export const SUPERADMIN_SETUP_WIZARD_STEPS = [
  { num: 1, titleKey: 'COPY.STEP_1_TITLE', descKey: 'COPY.STEP_1_DESC' },
  { num: 2, titleKey: 'COPY.STEP_2_TITLE', descKey: 'COPY.STEP_2_DESC' },
  { num: 3, titleKey: 'COPY.STEP_3_TITLE', descKey: 'COPY.STEP_3_DESC' },
  { num: 4, titleKey: 'COPY.STEP_4_TITLE', descKey: 'COPY.STEP_4_DESC' },
  { num: 5, titleKey: 'COPY.STEP_5_TITLE', descKey: 'COPY.STEP_5_DESC' },
] as const;
