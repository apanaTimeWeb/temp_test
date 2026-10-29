'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchManagerGroupAdmission } from '@/app/frontend_manager/manager_members/members_group_admission/api/manager_members_group_admission.api';
import { MANAGER_STUDENTS_QUERY_KEYS } from '@/app/frontend_manager/manager_members/members_group_admission/api/manager_members_group_admission.query_keys';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

export function useManagerGroupAdmission() {
  return useQuery({
    queryKey: MANAGER_STUDENTS_QUERY_KEYS.list(),
    queryFn: fetchManagerGroupAdmission,
  });
}
