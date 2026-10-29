'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchManagerShiftMigrationAllocations,
  fetchManagerShiftMigrationLockerMatrix,
  fetchManagerShiftMigrationSeatHistory,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/api/manager_shifts_migration.api';
import { MANAGER_SHIFTS_MIGRATION_QUERY_KEYS } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/api/manager_shifts_migration.query_keys';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns Query server-state reads for lockers, allocations, and seat history. */
export function useManagerShiftMigrationAllocations() { return useQuery({ queryKey: MANAGER_SHIFTS_MIGRATION_QUERY_KEYS.allocations, queryFn: fetchManagerShiftMigrationAllocations }); }
export function useManagerShiftMigrationLockers() { return useQuery({ queryKey: MANAGER_SHIFTS_MIGRATION_QUERY_KEYS.lockerMatrix, queryFn: fetchManagerShiftMigrationLockerMatrix }); }
export function useManagerShiftMigrationSeatHistory() { return useQuery({ queryKey: MANAGER_SHIFTS_MIGRATION_QUERY_KEYS.seatHistory, queryFn: fetchManagerShiftMigrationSeatHistory }); }
