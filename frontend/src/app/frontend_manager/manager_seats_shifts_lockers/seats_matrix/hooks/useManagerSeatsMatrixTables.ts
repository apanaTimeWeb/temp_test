'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchManagerSeatMatrixAllocations,
  fetchManagerSeatMatrixLockerMatrix,
  fetchManagerSeatMatrixSeatHistory,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/api/manager_seats_matrix.api';
import { MANAGER_SEATS_MATRIX_QUERY_KEYS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/api/manager_seats_matrix.query_keys';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns Query server-state reads for lockers, allocations, and seat history. */
export function useManagerSeatMatrixAllocations() { return useQuery({ queryKey: MANAGER_SEATS_MATRIX_QUERY_KEYS.allocations, queryFn: fetchManagerSeatMatrixAllocations }); }
export function useManagerSeatMatrixLockers() { return useQuery({ queryKey: MANAGER_SEATS_MATRIX_QUERY_KEYS.lockerMatrix, queryFn: fetchManagerSeatMatrixLockerMatrix }); }
export function useManagerSeatMatrixSeatHistory() { return useQuery({ queryKey: MANAGER_SEATS_MATRIX_QUERY_KEYS.seatHistory, queryFn: fetchManagerSeatMatrixSeatHistory }); }
