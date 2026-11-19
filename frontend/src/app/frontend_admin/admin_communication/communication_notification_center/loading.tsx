'use client';

import { useTranslations } from 'next-intl';
import { AdminPageLoader } from '@/app/frontend_admin/components/AdminLoader';

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
