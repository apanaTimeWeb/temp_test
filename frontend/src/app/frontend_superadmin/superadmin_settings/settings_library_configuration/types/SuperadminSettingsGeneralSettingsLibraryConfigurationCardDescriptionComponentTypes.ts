// RESPONSIBILITY: Define compile-time types for settings library configuration; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_settings/settings_library_configuration/types/SuperadminSettingsGeneralSettingsLibraryConfigurationCardDescriptionComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_ui_primitives/SuperadminSettingsGeneralSettingsLibraryConfigurationCardDescription.tsx. */
import type { ReactNode } from 'react';

/**
 * Defines the public SuperadminSystemCardDescriptionProps contract for settings general. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property children Child content rendered within the owning component. Declared type: ReactNode.
 * @property className Display label for the owning feature. Declared type: string.
 */
export interface SuperadminSystemCardDescriptionProps { children: ReactNode; className?: string; }
