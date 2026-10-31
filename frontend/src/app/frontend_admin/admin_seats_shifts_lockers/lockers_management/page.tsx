'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** Physical locker key management belongs to manager operations; redirecting admin to canonical lockers matrix. */
export default function AdminLockersManagementRoute() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ADMIN_ROUTES.LOCKERS_MATRIX);
  }, [router]);
  return null;
}
