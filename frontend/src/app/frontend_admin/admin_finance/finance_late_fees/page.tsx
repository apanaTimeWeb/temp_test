'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** Late fee desk management belongs to manager operations; redirecting admin to canonical finance dashboard. */
export default function AdminFinanceLateFeesRoute() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ADMIN_ROUTES.FINANCE_DASHBOARD);
  }, [router]);
  return null;
}
