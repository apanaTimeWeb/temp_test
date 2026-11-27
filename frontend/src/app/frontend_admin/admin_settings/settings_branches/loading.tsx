'use client';

import { AdminPageLoader } from '@/app/frontend_admin/components/AdminLoader';
import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('ADMIN_BRANCHES');
  return <AdminPageLoader size="md" icon="building-2" variant="contra" label={t('LOADING')} />;
}
