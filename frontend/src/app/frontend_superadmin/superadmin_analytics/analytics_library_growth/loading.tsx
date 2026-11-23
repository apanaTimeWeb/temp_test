'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_analytics/analytics_library_growth; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/components/ui/loader/SuperadminLoader';
import { useTranslations } from 'next-intl';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminAnalyticsLibraryGrowthListSkeleton from './components/SuperadminAnalyticsLibraryGrowthListSkeleton';

export default function ModuleLoading() {
  const t = useTranslations('SUPERADMIN_REPORTS');
  return (
    <SuperadminPageLoader
      size="md"
      icon="trending-up"
      variant="contra"
      label={t('COPY.LOADING_MODULE')}
    />
  );
}
