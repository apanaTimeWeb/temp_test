'use client';

import { fetchManagerStudentById } from '@/app/frontend_manager/manager_members/members_alumni/api/manager_members_alumni.api';
import { MANAGER_STUDENTS_QUERY_KEYS } from '@/app/frontend_manager/manager_members/members_alumni/api/manager_members_alumni.query_keys';
import { useQuery } from '@tanstack/react-query';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

export function useManagerAlumniStudent(id: string) {
  return useQuery({
    queryKey: MANAGER_STUDENTS_QUERY_KEYS.detail(id),
    queryFn: () => fetchManagerStudentById(id),
    enabled: Boolean(id),
  });
}
