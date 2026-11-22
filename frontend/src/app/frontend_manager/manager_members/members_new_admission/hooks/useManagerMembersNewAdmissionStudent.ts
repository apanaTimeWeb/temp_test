'use client';

import { fetchManagerStudentById } from '@/app/frontend_manager/manager_members/members_new_admission/api/manager_members_new_admission.api';
import { MANAGER_STUDENTS_QUERY_KEYS } from '@/app/frontend_manager/manager_members/members_new_admission/api/manager_members_new_admission.query_keys';
import { useQuery } from '@tanstack/react-query';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

export function useManagerNewAdmissionStudent(id: string) {
  return useQuery({
    queryKey: MANAGER_STUDENTS_QUERY_KEYS.detail(id),
    queryFn: () => fetchManagerStudentById(id),
    enabled: Boolean(id),
  });
}
