// RESPONSIBILITY: Define local sample fixtures for libraries profile configuration; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_libraries/libraries_profile_configuration/mocks/fixtures/SuperadminLibrariesProfileConfigurationPreviewDefaults.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminSystemProfileFormValues } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/schemas/SuperadminLibrariesProfileConfigurationSchema';

/** Synthetic form defaults for isolated UI preview/stress testing only; not a backend profile payload. */
export const SUPERADMIN_LIBRARIES_PROFILE_CONFIGURATION_PREVIEW_DEFAULTS: SuperadminSystemProfileFormValues = {
  fullName: 'Sample Superadmin',
  email: 'sample-admin@example.invalid',
  phone: '+91 00000 00000',
};
