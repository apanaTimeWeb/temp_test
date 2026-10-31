'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** Merged into members_directory; redirecting to the canonical directory route. */
export default function AdminMembersStudentsRoute() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ADMIN_ROUTES.MEMBERS_DIRECTORY);
  }, [router]);

  return null;
}
