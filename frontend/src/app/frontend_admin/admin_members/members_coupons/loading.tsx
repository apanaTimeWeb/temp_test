'use client';

import { useTranslations } from 'next-intl';
import { AdminPageLoader } from '@/app/frontend_admin/components/AdminLoader';

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
