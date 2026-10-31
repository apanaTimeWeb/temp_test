'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** Student shift migration belongs to manager operations; redirecting admin to canonical shifts management. */
export default function AdminShiftsMigrationRoute() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ADMIN_ROUTES.SHIFTS_MANAGEMENT);
  }, [router]);
  return null;
}
