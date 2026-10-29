'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchManagerLockersAllocations,
  fetchManagerLockersLockerMatrix,
  fetchManagerLockersSeatHistory,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/api/manager_lockers_management.api';
import { MANAGER_LOCKERS_MANAGEMENT_QUERY_KEYS } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/api/manager_lockers_management.query_keys';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns Query server-state reads for lockers, allocations, and seat history. */
export function useManagerLockersAllocations() { return useQuery({ queryKey: MANAGER_LOCKERS_MANAGEMENT_QUERY_KEYS.allocations, queryFn: fetchManagerLockersAllocations }); }
export function useManagerLockersManagement() { return useQuery({ queryKey: MANAGER_LOCKERS_MANAGEMENT_QUERY_KEYS.lockerMatrix, queryFn: fetchManagerLockersLockerMatrix }); }
export function useManagerLockersSeatHistory() { return useQuery({ queryKey: MANAGER_LOCKERS_MANAGEMENT_QUERY_KEYS.seatHistory, queryFn: fetchManagerLockersSeatHistory }); }
