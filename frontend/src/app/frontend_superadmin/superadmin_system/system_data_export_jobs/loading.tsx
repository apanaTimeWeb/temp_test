'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_system/system_data_export_jobs; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/app/frontend_superadmin/components/SuperadminLoader';
import { useTranslations } from 'next-intl';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminDataExportJobsListSkeleton from './components/SuperadminDataExportJobsListSkeleton';

export default function ModuleLoading() {
  const t = useTranslations('SUPERADMIN_SYSTEM');
  return (
    <SuperadminPageLoader
      size="md"
      icon="file-spreadsheet"
      variant="contra"
      label={t('COPY.LOADING_MODULE')}
    />
  );
}
