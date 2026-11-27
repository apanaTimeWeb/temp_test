'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_communication/communication_notification_center; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/components/ui/loader/SuperadminLoader';
import { useTranslations } from 'next-intl';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminCommunicationNotificationCenterListSkeleton from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterListSkeleton';

export default function ModuleLoading() {
  const t = useTranslations('SUPERADMIN_COMMUNICATION');
  return (
    <SuperadminPageLoader
      size="md"
      icon="radio"
      variant="contra"
      label={t('COPY.LOADING_MODULE')}
    />
  );
}
