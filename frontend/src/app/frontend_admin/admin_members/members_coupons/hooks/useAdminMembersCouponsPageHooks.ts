'use client';
// DATA FLOW: coupons route -> page-scoped client state and query hooks; no unverified live mutation is implied.
import { ADMIN_COUPONS_QUERY_KEYS } from '@/app/frontend_admin/admin_members/members_coupons/api/admin_members_coupons.query_keys';
import { fetchAdminCoupons,mapAdminCouponsApiRecords } from '@/app/frontend_admin/admin_members/members_coupons/api/admin_members_coupons_api';
import { ADMIN_COUPONS_API_FIXTURE } from '@/app/frontend_admin/admin_members/members_coupons/config/admin_members_coupons.demo_data';
import { AdminCouponsApiResponseSchema } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export function useAdminMembersCouponsState() {
  const [showForm, setShowForm] = useState(false);
  return { showForm, setShowForm } as const;
}

/** Owns the list query. Demo fixture data is never used for a live query or a persisted mutation. */
export function useAdminCouponsListQuery() {
  const isDemoMode = isFrontendDemoModeEnabled();
  return useQuery({
    queryKey: ADMIN_COUPONS_QUERY_KEYS.list({ mode: isDemoMode ? 'demo' : 'live' }),
    queryFn: () => {
      if (!isDemoMode) return fetchAdminCoupons();
      const fixture = AdminCouponsApiResponseSchema.parse(ADMIN_COUPONS_API_FIXTURE);
      return Promise.resolve(mapAdminCouponsApiRecords(fixture));
    },
  });
}

