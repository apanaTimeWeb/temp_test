'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchManagerLockerMatrixAllocations,
  fetchManagerLockersMatrix,
  fetchManagerLockerMatrixSeatHistory,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/api/manager_lockers_matrix.api';
import { MANAGER_LOCKERS_MATRIX_QUERY_KEYS } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/api/manager_lockers_matrix.query_keys';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns Query server-state reads for lockers, allocations, and seat history. */
export function useManagerLockerMatrixAllocations() { return useQuery({ queryKey: MANAGER_LOCKERS_MATRIX_QUERY_KEYS.allocations, queryFn: fetchManagerLockerMatrixAllocations }); }
export function useManagerLockerMatrixLockers() { return useQuery({ queryKey: MANAGER_LOCKERS_MATRIX_QUERY_KEYS.lockerMatrix, queryFn: fetchManagerLockersMatrix }); }
export function useManagerLockerMatrixSeatHistory() { return useQuery({ queryKey: MANAGER_LOCKERS_MATRIX_QUERY_KEYS.seatHistory, queryFn: fetchManagerLockerMatrixSeatHistory }); }
