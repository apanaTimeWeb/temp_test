'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** Seat history is tracked at branch desk; redirecting admin to canonical seats matrix. */
export default function AdminSeatsHistoryRoute() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ADMIN_ROUTES.SEATS_MATRIX);
  }, [router]);
  return null;
}
