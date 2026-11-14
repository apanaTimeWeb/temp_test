/** Responsibility: Route adapter for the data_export_jobs screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminDataExportJobsScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `data_export` inside the data_export_jobs autonomous module. */
import SuperadminSystemDataExportPageClient from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/components/SuperadminDataExportJobsPageClient';

/**
 * Composes the data export jobs screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminDataExportJobsScreen({ id }: { id?: string }) {
  return <SuperadminSystemDataExportPageClient />;
}
