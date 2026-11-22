'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_support/support_tickets; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/app/frontend_superadmin/components/SuperadminLoader';
import { useTranslations } from 'next-intl';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSupportTicketsListSkeleton from './components/SuperadminSupportTicketsListSkeleton';

export default function ModuleLoading() {
  const t = useTranslations('SUPERADMIN_SUPPORT_TICKETS');
  return (
    <SuperadminPageLoader
      size="md"
      icon="life-buoy"
      variant="contra"
      label={t('COPY.LOADING_MODULE')}
    />
  );
}
