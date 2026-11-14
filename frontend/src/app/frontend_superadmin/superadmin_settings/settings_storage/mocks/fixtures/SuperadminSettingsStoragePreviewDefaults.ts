// RESPONSIBILITY: Define local sample fixtures for settings storage; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_settings/settings_storage/mocks/fixtures/SuperadminSettingsStoragePreviewDefaults.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_storage/types/SuperadminSettingsStorageTypes';

/** Illustrative local form defaults only; these values are not read from or saved to a live host configuration. */
export const SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS: SuperadminSettingsFormValues = {
  generalConfig: {
    platformName: 'Library OS',
    supportEmail: 'support@example.invalid',
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata',
  },
  apiConfig: {
    emailProvider: 'AWS SES',
    smsProvider: 'Twilio',
  },
  maintenance: {
    enabled: false,
    message: 'Example maintenance message for preview only.',
  },
};
