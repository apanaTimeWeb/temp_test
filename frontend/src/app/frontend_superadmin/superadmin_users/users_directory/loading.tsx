'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_users/users_directory; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/app/frontend_superadmin/components/SuperadminLoader';
import { useTranslations } from 'next-intl';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminUsersDirectoryListSkeleton from './components/SuperadminUsersDirectoryListSkeleton';

export default function ModuleLoading() {
  const t = useTranslations('SUPERADMIN_USERS');
  return (
    <SuperadminPageLoader
      size="md"
      icon="users"
      variant="contra"
      label={t('COPY.LOADING_MODULE')}
    />
  );
}
