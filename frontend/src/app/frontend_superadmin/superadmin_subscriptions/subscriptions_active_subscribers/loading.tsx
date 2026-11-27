'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_subscriptions/subscriptions_active_subscribers; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/components/ui/loader/SuperadminLoader';
import { useTranslations } from 'next-intl';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSubscriptionsActiveSubscribersListSkeleton from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_active_subscribers/components/SuperadminSubscriptionsActiveSubscribersListSkeleton';

export default function ModuleLoading() {
  const t = useTranslations('SUPERADMIN_SUBSCRIPTIONS');
  return (
    <SuperadminPageLoader
      size="md"
      icon="crown"
      variant="contra"
      label={t('COPY.LOADING_MODULE')}
    />
  );
}
