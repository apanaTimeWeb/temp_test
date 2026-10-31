'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** Physical security deposit handovers belong to manager desk; redirecting admin to canonical finance dashboard. */
export default function AdminFinanceSecurityDepositsRoute() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ADMIN_ROUTES.FINANCE_DASHBOARD);
  }, [router]);
  return null;
}
