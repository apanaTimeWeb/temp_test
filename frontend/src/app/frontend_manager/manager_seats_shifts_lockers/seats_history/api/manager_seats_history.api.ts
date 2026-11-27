import { MANAGER_SEATS_HISTORY_API } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/config/manager_seats_history.url_config';
import type { LockerData,ManagerSeatsHistoryAllocationRow,ManagerSeatsHistoryRow,SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/types/ManagerSeatsHistoryTypes';
import { normalizeManagerLockerMatrixStatus,normalizeManagerSeatMatrixStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/utils/ManagerSeatsHistoryMatrixStatus';
import { normalizeManagerSeatsAllocationStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/utils/ManagerSeatsHistoryStatusNormalization';
import { apiFetch } from '@/lib/api';
import { z } from 'zod';

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
  MANAGER_SEATS_HISTORY_DEMO_ALLOCATIONS,
  MANAGER_SEATS_HISTORY_DEMO_HISTORY,
  MANAGER_SEATS_HISTORY_DEMO_LOCKERS,
  MANAGER_SEATS_HISTORY_DEMO_SEAT_MATRIX,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/config/manager_seats_history.demo_data';

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
    if (endpoint === MANAGER_SEATS_HISTORY_API.SEAT_MATRIX) {
      return MANAGER_SEATS_HISTORY_DEMO_SEAT_MATRIX as unknown as Record<string, unknown>[];
    }
    if (endpoint === MANAGER_SEATS_HISTORY_API.LOCKERS) {
      return MANAGER_SEATS_HISTORY_DEMO_LOCKERS as unknown as Record<string, unknown>[];
    }
    if (endpoint === MANAGER_SEATS_HISTORY_API.ALLOCATIONS) {
      return MANAGER_SEATS_HISTORY_DEMO_ALLOCATIONS as unknown as Record<string, unknown>[];
    }
    if (endpoint === MANAGER_SEATS_HISTORY_API.HISTORY) {
      return MANAGER_SEATS_HISTORY_DEMO_HISTORY as unknown as Record<string, unknown>[];
    }
    throw error;
  }
}

export async function fetchManagerSeatHistorySeatMatrix(): Promise<SeatData[]> {
  const raw = await fetchValidatedRecords(MANAGER_SEATS_HISTORY_API.SEAT_MATRIX);
  return raw.map((item) => {
    return { uuid: optionalString(item, 'id'), id: requiredString(item, 'seatNumber').replace(/^S-/, ''), status: normalizeManagerSeatMatrixStatus(item.status, item), student: optionalString(item, 'studentName'), smartId: optionalString(item, 'smartId'), shift: optionalString(item, 'shift'), expiry: optionalString(item, 'expiry', 'expiryDate') };
  });
}
export async function fetchManagerSeatHistoryLockerMatrix(): Promise<LockerData[]> {
  const raw = await fetchValidatedRecords(MANAGER_SEATS_HISTORY_API.LOCKERS);
  return raw.map((item) => {
    return { uuid: optionalString(item, 'id'), id: requiredString(item, 'lockerNumber').replace(/^L-/, ''), status: normalizeManagerLockerMatrixStatus(item.status, item), student: optionalString(item, 'studentName'), smartId: optionalString(item, 'smartId'), location: optionalString(item, 'location') };
  });
}
export async function fetchManagerSeatHistoryAllocations(): Promise<ManagerSeatsHistoryAllocationRow[]> {
  const raw = await fetchValidatedRecords(MANAGER_SEATS_HISTORY_API.ALLOCATIONS);
  return raw.map((item) => ({
    id: requiredString(item, 'id'), studentName: requiredString(item, 'studentName', 'student'), smartId: requiredString(item, 'smartId', 'studentId'),
    seatNo: requiredString(item, 'seatNo', 'seatNumber'), shift: requiredString(item, 'shift'),
    customSlots: optionalString(item, 'customSlots', 'slots') ?? '—', lockerNo: optionalString(item, 'lockerNo', 'lockerNumber') ?? '—',
    validFrom: requiredString(item, 'validFrom', 'startDate'), validTill: requiredString(item, 'validTill', 'endDate'),
    daysLeft: requiredFiniteNumber(item, 'daysLeft'), status: statusLabel(item.status) as ManagerSeatsHistoryAllocationRow['status'],
  }));
}
export async function fetchManagerSeatsHistory(): Promise<ManagerSeatsHistoryRow[]> {
  const raw = await fetchValidatedRecords(MANAGER_SEATS_HISTORY_API.HISTORY);
  return raw.map((item) => ({
    seatNo: requiredString(item, 'seatNo', 'seatNumber'), studentName: requiredString(item, 'studentName', 'student'), smartId: requiredString(item, 'smartId', 'studentId'), shift: requiredString(item, 'shift'),
    occupiedFrom: requiredString(item, 'occupiedFrom', 'startDate'), occupiedTill: requiredString(item, 'occupiedTill', 'endDate'), duration: optionalString(item, 'duration') ?? '—',
    reason: (item.reason === 'Admission' || item.reason === 'Seat Change' || item.reason === 'Shift Change' ? item.reason : typeof item.reason === 'string' && item.reason.trim() ? item.reason : 'unknown') as ManagerSeatsHistoryRow['reason'],
    status: optionalString(item, 'status') ?? 'Active',
  }));
}
