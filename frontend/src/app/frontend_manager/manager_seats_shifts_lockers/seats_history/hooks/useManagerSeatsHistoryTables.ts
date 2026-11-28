'use client';

import { fetchManagerSeatsHistory } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/api/manager_seats_history.api';
import { MANAGER_SEATS_HISTORY_QUERY_KEYS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/api/manager_seats_history.query_keys';
import { useQuery } from '@tanstack/react-query';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns Query server-state reads for seat history. */
export function useManagerSeatsHistory() { return useQuery({ queryKey: MANAGER_SEATS_HISTORY_QUERY_KEYS.seatHistory, queryFn: fetchManagerSeatsHistory }); }
