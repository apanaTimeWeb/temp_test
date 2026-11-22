'use client';

import { AdminPageLoader } from '@/app/frontend_admin/components/AdminLoader';
import { useTranslations } from 'next-intl';

export default function AdminDashboardReportsLoading() {
  const t = useTranslations('ADMIN_NAVIGATION');
  return (
    <AdminPageLoader
      size="md"
      icon="chart-bar"
      variant="contra"
      label={t('LOADING_PAGE')}
    />
  );
}
