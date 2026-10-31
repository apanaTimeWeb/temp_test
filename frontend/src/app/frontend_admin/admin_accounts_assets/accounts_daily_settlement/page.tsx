'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** Cash drawer counting belongs to manager operations; redirecting admin to canonical accounts financial reports. */
export default function AdminAccountsDailySettlementRoute() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ADMIN_ROUTES.ACCOUNTS_FINANCIAL_REPORTS);
  }, [router]);
  return null;
}
