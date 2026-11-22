'use client';

import { AdminPageLoader } from '@/app/frontend_admin/components/AdminLoader';
import { useTranslations } from 'next-intl';

export default function AdminMembersLoading() {
  const t = useTranslations('ADMIN_COUPONS');
  return (
    <AdminPageLoader
      size="md"
      icon="ticket"
      variant="contra"
      label={t('ROUTE_LOADING.ARIA_LABEL')}
      screenReaderText={t('ROUTE_LOADING.SCREEN_READER_TEXT')}
    />
  );
}
