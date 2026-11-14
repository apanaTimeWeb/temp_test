// RESPONSIBILITY: Define local sample fixtures for settings library configuration; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_settings/settings_library_configuration/mocks/fixtures/SuperadminSettingsLibraryConfigurationPreviewDefaults.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminSystemSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/schemas/SuperadminSettingsGeneralSettingsLibraryConfigurationSchema';

/** Synthetic local form defaults for preview/stress fixtures only; this is not an API payload contract. */
export const SUPERADMIN_SETTINGS_LIBRARY_CONFIGURATION_PREVIEW_DEFAULTS: SuperadminSystemSettingsFormValues = {
  appName: 'Library OS',
  primaryColor: '',
  secondaryColor: '',
  gracePeriod: 5,
  penaltyPerDay: 50,
  enableLateFees: true,
  daysBefore: 10,
  enableAutoSuspend: true,
  enableAutoRestore: true,
  upiId: 'owner@upi',
  acceptCash: true,
  acceptUpi: true,
  acceptCard: false,
  acceptBank: false,
  libraryName: 'Library OS',
  libraryTimezone: 'Asia/Kolkata (IST)',
  libraryCurrency: 'INR (₹)',
};
