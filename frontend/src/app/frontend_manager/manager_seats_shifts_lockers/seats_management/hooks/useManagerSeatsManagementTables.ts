'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchManagerSeatsAllocations,
  fetchManagerSeatsLockerMatrix,
  fetchManagerSeatsSeatHistory,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/api/manager_seats_management.api';
import { MANAGER_SEATS_MANAGEMENT_QUERY_KEYS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/api/manager_seats_management.query_keys';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns Query server-state reads for lockers, allocations, and seat history. */
export function useManagerSeatsAllocations() { return useQuery({ queryKey: MANAGER_SEATS_MANAGEMENT_QUERY_KEYS.allocations, queryFn: fetchManagerSeatsAllocations }); }
export function useManagerSeatsLockers() { return useQuery({ queryKey: MANAGER_SEATS_MANAGEMENT_QUERY_KEYS.lockerMatrix, queryFn: fetchManagerSeatsLockerMatrix }); }
export function useManagerSeatsSeatHistory() { return useQuery({ queryKey: MANAGER_SEATS_MANAGEMENT_QUERY_KEYS.seatHistory, queryFn: fetchManagerSeatsSeatHistory }); }
