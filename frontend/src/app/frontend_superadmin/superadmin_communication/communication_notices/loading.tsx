'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_communication/communication_notices; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/components/ui/loader/SuperadminLoader';
import { useTranslations } from 'next-intl';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminCommunicationNoticesListSkeleton from '@/app/frontend_superadmin/superadmin_communication/communication_notices/components/SuperadminCommunicationNoticesListSkeleton';

export default function ModuleLoading() {
  const t = useTranslations('SUPERADMIN_COMMUNICATION');
  return (
    <SuperadminPageLoader
      size="md"
      icon="bell"
      variant="contra"
      label={t('COPY.LOADING_MODULE')}
    />
  );
}
