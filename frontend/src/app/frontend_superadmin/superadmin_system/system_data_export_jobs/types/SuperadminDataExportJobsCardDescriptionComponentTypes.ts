// RESPONSIBILITY: Define compile-time types for system data export jobs; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_data_export_jobs/types/SuperadminDataExportJobsCardDescriptionComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_ui_primitives/SuperadminDataExportJobsCardDescription.tsx. */
import type { ReactNode } from 'react';

/**
 * Defines the public SuperadminSystemCardDescriptionProps contract for data export jobs. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property children Child content rendered within the owning component. Declared type: ReactNode.
 * @property className Display label for the owning feature. Declared type: string.
 */
export interface SuperadminSystemCardDescriptionProps { children: ReactNode; className?: string; }
