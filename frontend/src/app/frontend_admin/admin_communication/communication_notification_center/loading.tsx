'use client';

import { AdminPageLoader } from '@/app/frontend_admin/components/AdminLoader';
import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('ADMIN_COMMUNICATION.ROUTE_LOADING');
  return (
    <AdminPageLoader
      size="md"
      icon="bell-ring"
      variant="contra"
      label={t('ARIA_LABEL')}
      screenReaderText={t('SCREEN_READER_TEXT')}
    />
  );
}
