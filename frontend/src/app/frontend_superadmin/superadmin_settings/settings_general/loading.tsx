'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_settings/settings_general; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/components/ui/loader/SuperadminLoader';
import { useTranslations } from 'next-intl';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSettingsGeneralListSkeleton from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralListSkeleton';

export default function ModuleLoading() {
  const t = useTranslations('SUPERADMIN_SETTINGS');
  return (
    <SuperadminPageLoader
      size="md"
      icon="settings"
      variant="contra"
      label={t('COPY.LOADING_MODULE')}
    />
  );
}
