'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** Front-desk payment promises belong to manager operations; redirecting admin to canonical finance dashboard. */
export default function AdminFinancePaymentPromisesRoute() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ADMIN_ROUTES.FINANCE_DASHBOARD);
  }, [router]);
  return null;
}
