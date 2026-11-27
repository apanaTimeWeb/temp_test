'use client';

import AdminCouponsPage from '@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsPage';
import AdminErrorBoundary from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveErrorBoundary';
import { useTranslations } from 'next-intl';

export default function AdminMembersCouponsMain() {
  const t = useTranslations('ADMIN_COUPONS');
  return (
    <AdminErrorBoundary
      title={t('ERROR_BOUNDARY_TITLE')}
      description={t('ERROR_BOUNDARY_FALLBACK')}
      retryLabel={t('ERROR_BOUNDARY_RETRY')}
    >
      <AdminCouponsPage />
    </AdminErrorBoundary>
  );
}
