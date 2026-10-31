'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** Shift gap analysis redirects to canonical shifts management. */
export default function AdminShiftsGapRoute() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ADMIN_ROUTES.SHIFTS_MANAGEMENT);
  }, [router]);
  return null;
}
