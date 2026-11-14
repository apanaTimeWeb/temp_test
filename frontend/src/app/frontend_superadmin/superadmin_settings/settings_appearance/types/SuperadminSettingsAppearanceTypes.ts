// FLOW: Feature source -> settings_appearance types -> preview-only local state contract.
/** Declares only values rendered by the local Appearance preview; these are not persisted settings. */
import type { z } from 'zod';
import type { SUPERADMIN_SETTINGS_APPEARANCE_PREVIEW_SCHEMA } from '@/app/frontend_superadmin/superadmin_settings/settings_appearance/schemas/SuperadminSettingsAppearanceSchema';

export type SuperadminSettingsAppearancePreviewValues = z.infer<typeof SUPERADMIN_SETTINGS_APPEARANCE_PREVIEW_SCHEMA>;
