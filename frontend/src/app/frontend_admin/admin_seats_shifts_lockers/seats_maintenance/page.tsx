'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** Seat maintenance operations redirect to canonical seats management. */
export default function AdminSeatsMaintenanceRoute() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ADMIN_ROUTES.SEATS_MANAGEMENT);
  }, [router]);
  return null;
}
