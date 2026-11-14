// RESPONSIBILITY: Define compile-time types for libraries onboarding setup; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_onboarding_setup/types/SuperadminLibrariesOnboardingSetupSkipModalComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_setup_wizard/superadmin_setup_wizard_components/superadmin_setup_wizard_modals/SuperadminLibrariesOnboardingSetupSkipModal.tsx. */
export interface SuperadminSetupWizardSkipModalProps {
  onClose: () => void;
  onConfirm: () => void;
}
