// RESPONSIBILITY: Define local sample fixtures for settings appearance; values are preview-only and are not persisted.
// FLOW: Appearance preview -> local defaults -> controlled UI state.
import type { SuperadminSettingsAppearancePreviewValues } from '@/app/frontend_superadmin/superadmin_settings/settings_appearance/types/SuperadminSettingsAppearanceTypes';

export const SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS: SuperadminSettingsAppearancePreviewValues = {
  previewDensity: 'comfortable',
  previewAccent: 'neutral',
};
