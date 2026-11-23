'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_system/system_backup_configuration; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/components/ui/loader/SuperadminLoader';
import { useTranslations } from 'next-intl';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminBackupConfigurationListSkeleton from './components/SuperadminBackupConfigurationListSkeleton';

export default function ModuleLoading() {
  const t = useTranslations('SUPERADMIN_SYSTEM');
  return (
    <SuperadminPageLoader
      size="md"
      icon="sliders"
      variant="contra"
      label={t('COPY.LOADING_MODULE')}
    />
  );
}
