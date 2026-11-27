'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_security/security_overview; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/components/ui/loader/SuperadminLoader';
import { useTranslations } from 'next-intl';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSecurityOverviewListSkeleton from '@/app/frontend_superadmin/superadmin_security/security_overview/components/SuperadminSecurityOverviewListSkeleton';

export default function ModuleLoading() {
  const t = useTranslations('SUPERADMIN_SECURITY');
  return (
    <SuperadminPageLoader
      size="md"
      icon="shield-check"
      variant="contra"
      label={t('COPY.LOADING_MODULE')}
    />
  );
}
