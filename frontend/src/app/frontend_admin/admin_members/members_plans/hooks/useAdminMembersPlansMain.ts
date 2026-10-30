// DATA FLOW: members_plans route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
import { useQuery } from '@tanstack/react-query';
import { fetchAdminPlans } from '@/app/frontend_admin/admin_members/members_plans/api/admin_members_plans_api';
import { ADMIN_PLANS_QUERY_KEYS } from '@/app/frontend_admin/admin_members/members_plans/api/admin_members_plans.query_keys';

/** Owns the Plans server-state lifecycle and stable feature query key. */
export function useAdminPlans(enabled = true) {
  return useQuery({
    queryKey: ADMIN_PLANS_QUERY_KEYS.list(),
    queryFn: fetchAdminPlans,
    enabled,
  });
}
