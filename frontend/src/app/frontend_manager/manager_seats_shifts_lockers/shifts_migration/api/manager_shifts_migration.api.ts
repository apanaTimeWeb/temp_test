import { z } from 'zod';
import { apiFetch } from '@/lib/api';
import type { ManagerShiftsMigrationAllocationRow, ManagerShiftsMigrationSeatHistoryRow, LockerData, SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/types/ManagerShiftsMigrationTypes';
import { MANAGER_SHIFTS_MIGRATION_API } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/config/manager_shifts_migration.url_config';
import { normalizeManagerSeatsAllocationStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/utils/ManagerShiftsMigrationStatusNormalization';
import { normalizeManagerLockerMatrixStatus, normalizeManagerSeatMatrixStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/utils/ManagerShiftsMigrationMatrixStatus';

const recordSchema = z.record(z.string(), z.unknown());
const recordArraySchema = z.array(recordSchema);
function requiredString(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) { const value = record[key]; if (typeof value === 'string' && value.trim()) return value; }
  throw new Error(`Invalid seats/shifts/lockers response: missing ${keys.join(' or ')}.`);
}
function optionalString(record: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) { const value = record[key]; if (typeof value === 'string' && value.trim()) return value; }
  return undefined;
}
function requiredFiniteNumber(record: Record<string, unknown>, ...keys: string[]): number {
  for (const key of keys) { const value = record[key]; if (typeof value === 'number' && Number.isFinite(value)) return value; }
  throw new Error(`Invalid seats/shifts/lockers response: missing finite numeric field ${keys.join(' or ')}.`);
}
function statusLabel(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return 'unknown';
  return normalizeManagerSeatsAllocationStatus(value);
}

import {
  MANAGER_SEATS_SHIFTS_LOCKERS_ALLOCATIONS_FIXTURE,
  MANAGER_SEATS_SHIFTS_LOCKERS_HISTORY_FIXTURE,
  MANAGER_SEATS_SHIFTS_LOCKERS_LOCKERS_FIXTURE,
  MANAGER_SEATS_SHIFTS_LOCKERS_SEAT_MATRIX_FIXTURE,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/mocks/manager_shifts_migration_fixtures/ManagerShiftsMigrationApiFixtures';

async function fetchValidatedRecords(endpoint: string): Promise<Record<string, unknown>[]> {
  try {
    const response = await apiFetch<unknown>(endpoint);
    if (Array.isArray(response)) {
      return recordArraySchema.parse(response);
    }
    if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
      return recordArraySchema.parse((response as any).data);
    }
    if (!response.success) {
      throw new Error(response.message || 'Unable to load seats/shifts/lockers data.');
    }
    return recordArraySchema.parse(response.data);
  } catch (error) {
    if (endpoint === MANAGER_SHIFTS_MIGRATION_API.SEAT_MATRIX) {
      return MANAGER_SEATS_SHIFTS_LOCKERS_SEAT_MATRIX_FIXTURE as unknown as Record<string, unknown>[];
    }
    if (endpoint === MANAGER_SHIFTS_MIGRATION_API.LOCKERS) {
      return MANAGER_SEATS_SHIFTS_LOCKERS_LOCKERS_FIXTURE as unknown as Record<string, unknown>[];
    }
    if (endpoint === MANAGER_SHIFTS_MIGRATION_API.ALLOCATIONS) {
      return MANAGER_SEATS_SHIFTS_LOCKERS_ALLOCATIONS_FIXTURE as unknown as Record<string, unknown>[];
    }
    if (endpoint === MANAGER_SHIFTS_MIGRATION_API.HISTORY) {
      return MANAGER_SEATS_SHIFTS_LOCKERS_HISTORY_FIXTURE as unknown as Record<string, unknown>[];
    }
    throw error;
  }
}

export async function fetchManagerShiftMigrationSeatMatrix(): Promise<SeatData[]> {
  const raw = await fetchValidatedRecords(MANAGER_SHIFTS_MIGRATION_API.SEAT_MATRIX);
  return raw.map((item) => {
    return { uuid: optionalString(item, 'id'), id: requiredString(item, 'seatNumber').replace(/^S-/, ''), status: normalizeManagerSeatMatrixStatus(item.status, item), student: optionalString(item, 'studentName'), smartId: optionalString(item, 'smartId'), shift: optionalString(item, 'shift'), expiry: optionalString(item, 'expiry', 'expiryDate') };
  });
}
export async function fetchManagerShiftMigrationLockerMatrix(): Promise<LockerData[]> {
  const raw = await fetchValidatedRecords(MANAGER_SHIFTS_MIGRATION_API.LOCKERS);
  return raw.map((item) => {
    return { uuid: optionalString(item, 'id'), id: requiredString(item, 'lockerNumber').replace(/^L-/, ''), status: normalizeManagerLockerMatrixStatus(item.status, item), student: optionalString(item, 'studentName'), smartId: optionalString(item, 'smartId'), location: optionalString(item, 'location') };
  });
}
export async function fetchManagerShiftMigrationAllocations(): Promise<ManagerShiftsMigrationAllocationRow[]> {
  const raw = await fetchValidatedRecords(MANAGER_SHIFTS_MIGRATION_API.ALLOCATIONS);
  return raw.map((item) => ({
    id: requiredString(item, 'id'), studentName: requiredString(item, 'studentName', 'student'), smartId: requiredString(item, 'smartId', 'studentId'),
    seatNo: requiredString(item, 'seatNo', 'seatNumber'), shift: requiredString(item, 'shift'),
    customSlots: optionalString(item, 'customSlots', 'slots') ?? '—', lockerNo: optionalString(item, 'lockerNo', 'lockerNumber') ?? '—',
    validFrom: requiredString(item, 'validFrom', 'startDate'), validTill: requiredString(item, 'validTill', 'endDate'),
    daysLeft: requiredFiniteNumber(item, 'daysLeft'), status: statusLabel(item.status) as ManagerShiftsMigrationAllocationRow['status'],
  }));
}
export async function fetchManagerShiftMigrationSeatHistory(): Promise<ManagerShiftsMigrationSeatHistoryRow[]> {
  const raw = await fetchValidatedRecords(MANAGER_SHIFTS_MIGRATION_API.HISTORY);
  return raw.map((item) => ({
    seatNo: requiredString(item, 'seatNo', 'seatNumber'), studentName: requiredString(item, 'studentName', 'student'), smartId: requiredString(item, 'smartId', 'studentId'), shift: requiredString(item, 'shift'),
    occupiedFrom: requiredString(item, 'occupiedFrom', 'startDate'), occupiedTill: requiredString(item, 'occupiedTill', 'endDate'), duration: optionalString(item, 'duration') ?? '—',
    reason: (item.reason === 'Admission' || item.reason === 'Seat Change' || item.reason === 'Shift Change' ? item.reason : typeof item.reason === 'string' && item.reason.trim() ? item.reason : 'unknown') as ManagerShiftsMigrationSeatHistoryRow['reason'],
  }));
}
