import { MANAGER_SEATS_MATRIX_API } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/config/manager_seats_matrix.url_config';
import type { LockerData,ManagerSeatsMatrixAllocationRow,ManagerSeatsMatrixSeatHistoryRow,SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import { normalizeManagerLockerMatrixStatus,normalizeManagerSeatMatrixStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/utils/ManagerSeatsMatrixMatrixStatus';
import { normalizeManagerSeatsAllocationStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/utils/ManagerSeatsMatrixStatusNormalization';
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
  MANAGER_SEATS_MATRIX_DEMO_ALLOCATIONS,
  MANAGER_SEATS_MATRIX_DEMO_HISTORY,
  MANAGER_SEATS_MATRIX_DEMO_LOCKERS,
  MANAGER_SEATS_MATRIX_DEMO_SEAT_MATRIX,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/config/manager_seats_matrix.demo_data';

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
    if (endpoint === MANAGER_SEATS_MATRIX_API.SEAT_MATRIX) {
      return MANAGER_SEATS_MATRIX_DEMO_SEAT_MATRIX as unknown as Record<string, unknown>[];
    }
    if (endpoint === MANAGER_SEATS_MATRIX_API.LOCKERS) {
      return MANAGER_SEATS_MATRIX_DEMO_LOCKERS as unknown as Record<string, unknown>[];
    }
    if (endpoint === MANAGER_SEATS_MATRIX_API.ALLOCATIONS) {
      return MANAGER_SEATS_MATRIX_DEMO_ALLOCATIONS as unknown as Record<string, unknown>[];
    }
    if (endpoint === MANAGER_SEATS_MATRIX_API.HISTORY) {
      return MANAGER_SEATS_MATRIX_DEMO_HISTORY as unknown as Record<string, unknown>[];
    }
    throw error;
  }
}

export async function fetchManagerSeatsMatrix(): Promise<SeatData[]> {
  const raw = await fetchValidatedRecords(MANAGER_SEATS_MATRIX_API.SEAT_MATRIX);
  return raw.map((item) => {
    const student = optionalString(item, 'studentName');
    let studentGender: 'Male' | 'Female' | undefined = undefined;
    if (student) {
      studentGender = (item.gender === 'Female' || item.studentGender === 'Female' || /priya|neha|ritu|pooja|shweta|anita|kavita|sunita|sneha|aditi/i.test(student)) ? 'Female' : 'Male';
    }
    const seatId = requiredString(item, 'seatNumber').replace(/^S-/, '');
    const rawWing = optionalString(item, 'wing');
    let resolvedWing = rawWing;
    if (!resolvedWing) {
      const num = parseInt(seatId.replace(/\D/g, ''), 10);
      if (!Number.isNaN(num)) {
        resolvedWing = num <= 10 ? 'AC Hall A' : num <= 20 ? 'AC Hall B' : num <= 30 ? 'Silent Zone' : 'Girls Cabin';
      } else {
        resolvedWing = seatId.startsWith('A') ? 'AC Hall A' : seatId.startsWith('B') ? 'AC Hall B' : seatId.startsWith('C') ? 'Silent Zone' : 'Girls Cabin';
      }
    }
    return {
      uuid: optionalString(item, 'id'),
      id: seatId,
      status: normalizeManagerSeatMatrixStatus(item.status, item),
      student,
      studentGender,
      smartId: optionalString(item, 'smartId'),
      shift: optionalString(item, 'shift'),
      expiry: optionalString(item, 'expiry', 'expiryDate'),
      wing: resolvedWing,
    };
  });
}
export async function fetchManagerSeatMatrixLockerMatrix(): Promise<LockerData[]> {
  const raw = await fetchValidatedRecords(MANAGER_SEATS_MATRIX_API.LOCKERS);
  return raw.map((item) => {
    return { uuid: optionalString(item, 'id'), id: requiredString(item, 'lockerNumber').replace(/^L-/, ''), status: normalizeManagerLockerMatrixStatus(item.status, item), student: optionalString(item, 'studentName'), smartId: optionalString(item, 'smartId'), location: optionalString(item, 'location') };
  });
}
export async function fetchManagerSeatMatrixAllocations(): Promise<ManagerSeatsMatrixAllocationRow[]> {
  const raw = await fetchValidatedRecords(MANAGER_SEATS_MATRIX_API.ALLOCATIONS);
  return raw.map((item) => ({
    id: requiredString(item, 'id'), studentName: requiredString(item, 'studentName', 'student'), smartId: requiredString(item, 'smartId', 'studentId'),
    seatNo: requiredString(item, 'seatNo', 'seatNumber'), shift: requiredString(item, 'shift'),
    customSlots: optionalString(item, 'customSlots', 'slots') ?? '—', lockerNo: optionalString(item, 'lockerNo', 'lockerNumber') ?? '—',
    validFrom: requiredString(item, 'validFrom', 'startDate'), validTill: requiredString(item, 'validTill', 'endDate'),
    daysLeft: requiredFiniteNumber(item, 'daysLeft'), status: statusLabel(item.status) as ManagerSeatsMatrixAllocationRow['status'],
  }));
}
export async function fetchManagerSeatMatrixSeatHistory(): Promise<ManagerSeatsMatrixSeatHistoryRow[]> {
  const raw = await fetchValidatedRecords(MANAGER_SEATS_MATRIX_API.HISTORY);
  return raw.map((item) => ({
    seatNo: requiredString(item, 'seatNo', 'seatNumber'), studentName: requiredString(item, 'studentName', 'student'), smartId: requiredString(item, 'smartId', 'studentId'), shift: requiredString(item, 'shift'),
    occupiedFrom: requiredString(item, 'occupiedFrom', 'startDate'), occupiedTill: requiredString(item, 'occupiedTill', 'endDate'), duration: optionalString(item, 'duration') ?? '—',
    reason: (item.reason === 'Admission' || item.reason === 'Seat Change' || item.reason === 'Shift Change' ? item.reason : typeof item.reason === 'string' && item.reason.trim() ? item.reason : 'unknown') as ManagerSeatsMatrixSeatHistoryRow['reason'],
  }));
}
