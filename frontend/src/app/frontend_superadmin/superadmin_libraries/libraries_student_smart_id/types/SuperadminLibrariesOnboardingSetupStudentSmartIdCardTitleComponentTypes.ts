// RESPONSIBILITY: Define compile-time types for libraries student smart id; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_student_smart_id/types/SuperadminLibrariesOnboardingSetupStudentSmartIdCardTitleComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_ui_primitives/SuperadminLibrariesOnboardingSetupStudentSmartIdCardTitle.tsx. */
import type { ReactNode } from 'react';

/**
 * Defines the public SuperadminSystemCardTitleProps contract for libraries onboarding setup. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property children Child content rendered within the owning component. Declared type: ReactNode.
 * @property className Display label for the owning feature. Declared type: string.
 */
export interface SuperadminSystemCardTitleProps { children: ReactNode; className?: string; }
