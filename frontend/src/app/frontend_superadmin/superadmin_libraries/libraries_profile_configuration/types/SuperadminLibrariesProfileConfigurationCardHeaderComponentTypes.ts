// RESPONSIBILITY: Define compile-time types for libraries profile configuration; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_profile_configuration/types/SuperadminLibrariesProfileConfigurationCardHeaderComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_ui_primitives/SuperadminLibrariesProfileConfigurationCardHeader.tsx. */
import type { ReactNode } from 'react';

/**
 * Defines the public SuperadminSystemCardHeaderProps contract for libraries profile configuration. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property children Child content rendered within the owning component. Declared type: ReactNode.
 * @property className Display label for the owning feature. Declared type: string.
 */
export interface SuperadminSystemCardHeaderProps { children: ReactNode; className?: string; }
