'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** Counter refund processing belongs to manager desk; redirecting admin to canonical payments ledger. */
export default function AdminFinanceRefundsRoute() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ADMIN_ROUTES.FINANCE_PAYMENTS);
  }, [router]);
  return null;
}
