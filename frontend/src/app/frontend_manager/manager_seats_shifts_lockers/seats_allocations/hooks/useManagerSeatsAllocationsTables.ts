'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchManagerSeatsAllocations,
  fetchManagerAllocationsLockerMatrix,
  fetchManagerAllocationsSeatHistory,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/api/manager_seats_allocations.api';
import { MANAGER_SEATS_ALLOCATIONS_QUERY_KEYS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/api/manager_seats_allocations.query_keys';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns Query server-state reads for lockers, allocations, and seat history. */
export function useManagerSeatsAllocations() { return useQuery({ queryKey: MANAGER_SEATS_ALLOCATIONS_QUERY_KEYS.allocations, queryFn: fetchManagerSeatsAllocations }); }
export function useManagerAllocationsLockers() { return useQuery({ queryKey: MANAGER_SEATS_ALLOCATIONS_QUERY_KEYS.lockerMatrix, queryFn: fetchManagerAllocationsLockerMatrix }); }
export function useManagerAllocationsSeatHistory() { return useQuery({ queryKey: MANAGER_SEATS_ALLOCATIONS_QUERY_KEYS.seatHistory, queryFn: fetchManagerAllocationsSeatHistory }); }
