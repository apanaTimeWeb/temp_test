'use client';

// RESPONSIBILITY: Render the route loading state for Superadmin; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/components/ui/loader/SuperadminLoader';
import { useTranslations } from 'next-intl';

export default function SuperadminLoading() {
  const t = useTranslations('SUPERADMIN_SHELL');
  return (
    <SuperadminPageLoader
      size="lg"
      icon="shield-check"
      variant="contra"
      label={t('COPY.LOADING_SUPERADMIN_WORKSPACE')}
    />
  );
}
