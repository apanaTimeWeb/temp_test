// RESPONSIBILITY: Define compile-time types for system data export jobs; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_data_export_jobs/types/SuperadminDataExportJobsCardContentComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_ui_primitives/SuperadminDataExportJobsCardContent.tsx. */
import type { ReactNode } from 'react';

/**
 * Defines the public SuperadminSystemCardContentProps contract for data export jobs. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property children Child content rendered within the owning component. Declared type: ReactNode.
 * @property className Display label for the owning feature. Declared type: string.
 */
export interface SuperadminSystemCardContentProps { children: ReactNode; className?: string; }
