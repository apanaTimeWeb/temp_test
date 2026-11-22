// RESPONSIBILITY: Define compile-time types for settings branding; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_settings/settings_branding/types/SuperadminSettingsBrandingCardTitleComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_ui_primitives/SuperadminSettingsBrandingCardTitle.tsx. */
import type { ReactNode } from 'react';

/**
 * Defines the public SuperadminSystemCardTitleProps contract for settings branding. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property children Child content rendered within the owning component. Declared type: ReactNode.
 * @property className Display label for the owning feature. Declared type: string.
 */
export interface SuperadminSystemCardTitleProps { children: ReactNode; className?: string; }
