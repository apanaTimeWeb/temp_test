'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_libraries/libraries_overview; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/components/ui/loader/SuperadminLoader';
import { useTranslations } from 'next-intl';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminLibrariesOverviewListSkeleton from './components/SuperadminLibrariesOverviewListSkeleton';

export default function ModuleLoading() {
  const t = useTranslations('SUPERADMIN_LIBRARIES');
  return (
    <SuperadminPageLoader
      size="md"
      icon="library"
      variant="contra"
      label={t('COPY.LOADING_MODULE')}
    />
  );
}
