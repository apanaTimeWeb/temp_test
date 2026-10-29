'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchManagerAlumni } from '@/app/frontend_manager/manager_members/members_alumni/api/manager_members_alumni.api';
import { MANAGER_STUDENTS_QUERY_KEYS } from '@/app/frontend_manager/manager_members/members_alumni/api/manager_members_alumni.query_keys';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

export function useManagerAlumni() {
  return useQuery({
    queryKey: MANAGER_STUDENTS_QUERY_KEYS.list(),
    queryFn: fetchManagerAlumni,
  });
}
