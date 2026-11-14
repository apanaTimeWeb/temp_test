// RESPONSIBILITY: Define compile-time types for system data export jobs; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_data_export_jobs/types/SuperadminDataExportJobsPageClientComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_system/superadmin_system_components/superadmin_system_views/superadmin_data_export_jobs_page/SuperadminDataExportJobsPageClient.tsx. */
import type { ReactNode } from 'react';
/**
 * Defines the public ExportModule contract for data export jobs. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property labelKey Display label for the owning feature. Declared type: string.
 * @property descriptionKey Value defined by the existing feature-local contract. Declared type: string.
 * @property icon Value defined by the existing feature-local contract. Declared type: string.
 * @property estimatedRows Value defined by the existing feature-local contract. Declared type: number.
 * @property formats Value defined by the existing feature-local contract. Declared type: string[].
 */
export interface ExportModule {
  id: string;
  labelKey: string;
  descriptionKey: string;
  icon: string;
  estimatedRows: number;
  formats: string[];
}

/**
 * Defines the public QuickExport contract for data export jobs. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property labelKey Display label for the owning feature. Declared type: string.
 * @property descriptionKey Value defined by the existing feature-local contract. Declared type: string.
 * @property icon Value defined by the existing feature-local contract. Declared type: ReactNode.
 * @property formatKey Value defined by the existing feature-local contract. Declared type: 'COPY.MANIFEST_CSV'.
 */
export interface QuickExport {
  id: string;
  labelKey: string;
  descriptionKey: string;
  icon: ReactNode;
  formatKey: 'COPY.MANIFEST_CSV';
}
