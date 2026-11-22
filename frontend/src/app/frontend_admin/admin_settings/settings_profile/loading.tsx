'use client';

import { AdminPageLoader } from '@/app/frontend_admin/components/AdminLoader';
import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('ADMIN_PROFILE');
  return (
    <AdminPageLoader
      size="md"
      icon="user"
      variant="contra"
      label={t('ROUTE_LOADING')}
    />
  );
}
