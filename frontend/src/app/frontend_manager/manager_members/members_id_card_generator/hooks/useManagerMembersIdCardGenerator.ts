'use client';

import { fetchManagerIdCardGenerator } from '@/app/frontend_manager/manager_members/members_id_card_generator/api/manager_members_id_card_generator.api';
import { MANAGER_STUDENTS_QUERY_KEYS } from '@/app/frontend_manager/manager_members/members_id_card_generator/api/manager_members_id_card_generator.query_keys';
import { useQuery } from '@tanstack/react-query';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

export function useManagerIdCardGenerator() {
  return useQuery({
    queryKey: MANAGER_STUDENTS_QUERY_KEYS.list(),
    queryFn: fetchManagerIdCardGenerator,
  });
}
