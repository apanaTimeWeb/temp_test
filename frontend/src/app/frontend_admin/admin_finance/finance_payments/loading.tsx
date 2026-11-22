'use client';

import { AdminPageLoader } from '@/app/frontend_admin/components/AdminLoader';
import { useTranslations } from 'next-intl';

export default function FeatureLoading() {
  const t = useTranslations('ADMIN_NAVIGATION');
  return (
    <AdminPageLoader
      size="md"
      icon="banknote"
      variant="contra"
      label={t('LOADING_PAGE')}
    />
  );
}
