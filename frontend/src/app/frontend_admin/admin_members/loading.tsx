'use client';

import { AdminPageLoader } from '@/app/frontend_admin/components/AdminLoader';
import { useTranslations } from 'next-intl';

export default function AdminMembersLoading() {
  const t = useTranslations('ADMIN_NAVIGATION');
  return (
    <AdminPageLoader
      size="md"
      icon="users"
      variant="contra"
      label={t('LOADING_PAGE')}
    />
  );
}
