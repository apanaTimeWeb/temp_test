'use client';

import { useTranslations } from 'next-intl';
import { AdminPageLoader } from '@/app/frontend_admin/components/AdminLoader';

export default function FeatureLoading() {
  const t = useTranslations('ADMIN_NAVIGATION');
  return (
    <AdminPageLoader
      size="md"
      icon="clipboard-list"
      variant="contra"
      label={t('LOADING_PAGE')}
    />
  );
}
