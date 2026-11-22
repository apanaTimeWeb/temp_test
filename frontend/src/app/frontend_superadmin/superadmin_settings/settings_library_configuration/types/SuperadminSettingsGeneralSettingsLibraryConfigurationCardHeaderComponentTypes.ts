// RESPONSIBILITY: Define compile-time types for settings library configuration; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_settings/settings_library_configuration/types/SuperadminSettingsGeneralSettingsLibraryConfigurationCardHeaderComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_ui_primitives/SuperadminSettingsGeneralSettingsLibraryConfigurationCardHeader.tsx. */
import type { ReactNode } from 'react';

/**
 * Defines the public SuperadminSystemCardHeaderProps contract for settings general. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property children Child content rendered within the owning component. Declared type: ReactNode.
 * @property className Display label for the owning feature. Declared type: string.
 */
export interface SuperadminSystemCardHeaderProps { children: ReactNode; className?: string; }
