'use client';

import { useTranslations } from 'next-intl';
import { AdminPageLoader } from '@/app/frontend_admin/components/AdminLoader';

export default function Loading() {
  const t = useTranslations('ADMIN_NAVIGATION');
  return (
    <AdminPageLoader
      size="md"
      icon="message-square-warning"
      variant="contra"
      label={t('LOADING_PAGE')}
    />
  );
}
