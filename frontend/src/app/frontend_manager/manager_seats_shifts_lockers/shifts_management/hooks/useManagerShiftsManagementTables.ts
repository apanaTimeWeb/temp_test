'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchManagerShiftsAllocations,
  fetchManagerShiftsLockerMatrix,
  fetchManagerShiftsSeatHistory,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/api/manager_shifts_management.api';
import { MANAGER_SHIFTS_MANAGEMENT_QUERY_KEYS } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/api/manager_shifts_management.query_keys';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns Query server-state reads for lockers, allocations, and seat history. */
export function useManagerShiftsAllocations() { return useQuery({ queryKey: MANAGER_SHIFTS_MANAGEMENT_QUERY_KEYS.allocations, queryFn: fetchManagerShiftsAllocations }); }
export function useManagerShiftsLockers() { return useQuery({ queryKey: MANAGER_SHIFTS_MANAGEMENT_QUERY_KEYS.lockerMatrix, queryFn: fetchManagerShiftsLockerMatrix }); }
export function useManagerShiftsSeatHistory() { return useQuery({ queryKey: MANAGER_SHIFTS_MANAGEMENT_QUERY_KEYS.seatHistory, queryFn: fetchManagerShiftsSeatHistory }); }
