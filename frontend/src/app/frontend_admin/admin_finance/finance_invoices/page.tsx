'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** Student invoicing belongs to manager counter operations; redirecting admin to canonical payments ledger. */
export default function AdminFinanceInvoicesRoute() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ADMIN_ROUTES.FINANCE_PAYMENTS);
  }, [router]);
  return null;
}
