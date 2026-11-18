'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

export function AdminFinanceDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ADMIN_ROUTES.FINANCE_PAYMENTS);
  }, [router]);

  return null;
}

export default AdminFinanceDashboardPage;
